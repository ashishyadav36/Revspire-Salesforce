import { LightningElement, api, wire, track } from 'lwc';
import getPitchLayouts from '@salesforce/apex/OpportunityPitchController.getPitchLayouts';
import getContentData from '@salesforce/apex/OpportunityPitchController.getContentData'; 
import contentLookup from 'c/contentLookup';
import revspireLogo from '@salesforce/resourceUrl/revspireLogo'
import Id from '@salesforce/user/Id';
import createPitch from '@salesforce/apex/PitchCreationController.createPitch';

export default class PitchDialog extends LightningElement {
    headerImage = revspireLogo;
    @api showModal = false; // Controlled by the parent component
    pitch = {
        name: '',
        opportunity_id: '',
        title: '',
        headline: '',
        description: '',
        pitch_layout: '',
        created_by: Id,
        sections: [{
            id: 1,
            name: '',
            contents: [
                {
                    id: '1-1',
                    content: '',
                    tagline: ''
                }
            ]
        }]
    };
    pitchLayouts = [];
    @api currentRecordId; // Bind to the exposed property (this is the Opportunity id which to sent to apex class)
    @api opportunityName; // Bind to the exposed property
    @track showNextInputFields = false; // Track the state of the component
    @track contentData = [];
    
    @track acceptedFormats = '.jpg,.png,.gif';
    orgLogoFile;
    backgroundImageFile;

    @wire(getPitchLayouts)
    wiredPitchLayouts({data, error}) {
        if(data) {
            this.pitchLayouts = data.map(layout => ({label: layout.Name, value: layout.Id}));
        } else if(error) {
            // Handle error
        }
    }
    
    @wire(getContentData)
    wiredContentData({ data, error }) {
        if (data) {
            // Handle the fetched content data
            this.contentData = data;
            console.log('Content Data:', data);
        } else if (error) {
            // Handle error
            console.error('Error fetching content data:', error);
        }
    }
    
    connectedCallback() {
    // Update the opportunity_id with the currentRecordId when the component is connected
    this.pitch.opportunity_id = this.currentRecordId;
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    handlePitchLayoutChange(event) {
        this.pitch.pitch_layout = event.detail.value;
    }

    handleNameChange(event) {
        this.pitch.name = event.target.value;
    }

    handleTitleChange(event) {
        this.pitch.title = event.target.value;
    }

    handleHeadlineChange(event) {
        this.pitch.headline = event.target.value;
    }

    handleDescriptionChange(event) {
        this.pitch.description = event.target.value;
    }

    handleOrgLogoUpload(event) {
        this.orgLogoFile = event.detail.files[0];
    }

    handleBackgroundImageUpload(event) {
        this.backgroundImageFile = event.detail.files[0];
    }


    handlesectionTitleChange(event) {
        const sectionId = parseInt(event.target.dataset.id, 10); // Convert to number
        if (!isNaN(sectionId)) {
            this.pitch.sections[sectionId - 1].name = event.target.value;
        }
    }
    
    handleContentSelected(event) {
        const contentPairId = event.target.dataset.id;
        const section = this.pitch.sections.find(section => section.contents.some(contentPair => contentPair.id === contentPairId));
        if (section) {
            const contentPair = section.contents.find(cp => cp.id === contentPairId);
            if (contentPair) {
                contentPair.content = event.detail;
            }
        }
    }

    handlesectionTaglineChange(event) {
        const contentPairId = event.target.dataset.id;
        const section = this.pitch.sections.find(section => section.contents.some(contentPair => contentPair.id === contentPairId));
        if (section) {
            const contentPair = section.contents.find(cp => cp.id === contentPairId);
            if (contentPair) {
                contentPair.tagline = event.target.value;
            }
        }
    }

    handleNext() {
        this.showNextInputFields = true;
    }

    handleBack() {
        this.showNextInputFields = false;
    }

    savePitch() {
    console.log("Pitch object to save:", this.pitch);
        

    // Iterate over sections and remove 'id' from each section
    this.pitch.sections.forEach(section => {
        delete section.id;
        // Iterate over contents within each section
        section.contents.forEach((content, index) => {
            // Remove 'id' from each content
            delete content.id;
            // Add 'arrangement' field to each content based on its order
            content.arrangement = index + 1;
        });
    }); 
    // Convert the pitch object to a JSON string
    const pitchJsonString = JSON.stringify(this.pitch);
    console.log("string pitch", pitchJsonString)
        
    // Call the Apex method to create the pitch
    createPitch({ jsonInput: pitchJsonString })
    .then(result => {
        console.log('Pitch created successfully:', result);
    })
    .catch(error => {
        console.error('Error creating pitch:', error);
    });

    this.closeModal();
    this.showNextInputFields = false;
    this.pitch = {
        name: '',
        opportunity_id: '',
        title: '',
        headline: '',
        description: '',
        pitch_layout: '',
        sections: [{
            id: 1,
            name: '',
            contents: [
                {
                    id: '1-1',
                    content: '',
                    tagline: ''
                }
            ]
        }]
    };
    }

    addsection() {
    const newsectionId = this.pitch.sections.length + 1;
    const contentPairs = [];
    contentPairs.push({
        id: `${newsectionId}-1`,
        content: '',
        tagline: ''
    });
    this.pitch.sections.push({
        id: newsectionId,
        name: '',
        contents: contentPairs
    });
    // Force a re-render by reassigning the pitch object to itself
    this.pitch = { ...this.pitch };
    }

    addContentPair(event) {
    const sectionId = parseInt(event.target.dataset.sectionId, 10);
    const section = this.pitch.sections.find(section => section.id === sectionId);
    if (section) {
        const newContentPairId = section.contents.length + 1;
        section.contents.push({
            id: `${sectionId}-${newContentPairId}`, // Adjusted id format
            content: '',
            tagline: ''
        });
        // Force a re-render by reassigning the pitch object to itself
        this.pitch = { ...this.pitch };
    }
}


    removeContentPair(event) {
    const contentPairId = event.target.dataset.id;
    const section = this.pitch.sections.find(section => section.contents.some(contentPair => contentPair.id === contentPairId));
    if (section) {
        section.contents = section.contents.filter(contentPair => contentPair.id !== contentPairId);
        // Force a re-render by reassigning the pitch object to itself
        this.pitch = { ...this.pitch };
    }
    }

   removesection(event) {
    const sectionId = event.target.dataset.id;
    this.pitch.sections = this.pitch.sections.filter(section => section.id !== parseInt(sectionId));
    // Force a re-render by reassigning the pitch object to itself
    this.pitch = { ...this.pitch };
   }

}
