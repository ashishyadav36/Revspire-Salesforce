import { LightningElement, api, wire, track } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityPitchController.getOpportunities';
import getPitchLayouts from '@salesforce/apex/OpportunityPitchController.getPitchLayouts';

export default class PitchDialog extends LightningElement {
    @api showModal = false; // Controlled by the parent component
    selectedPitchLayoutId = '';
    pitchLayouts = [];
    @api currentRecordId; // Bind to the exposed property (this is the Opportunity id which to sent to apex class)
    @api opportunityName; // Bind to the exposed property
    newPitchName = ''; // Store Pitch Name
    newPitchTitle = ''; // Store Title
    newPitchHeadline = ''; // Store Headline
    newPitchDescription = ''; // Store Description
    @track showNextInputFields = false; // Track the state of the component
    @track sections = [];

    @wire(getPitchLayouts)
        
    wiredPitchLayouts({data, error}) {
        if(data) {
            this.pitchLayouts = data.map(layout => ({label: layout.Name, value: layout.Id}));
        } else if(error) {
            // Handle error
        }
    }

    closeModal() {
        console.log("Array is here !",this.sections)
        console.log("Close modal is Pressed !")
        this.dispatchEvent(new CustomEvent('close'));

    }


    handlePitchLayoutChange(event) {
        this.selectedPitchLayoutId = event.detail.value;
    }

    handleNameChange(event) {
        this.newPitchName = event.target.value;
    }

    handleTitleChange(event) {
        this.newPitchTitle = event.target.value;
    }

    handleHeadlineChange(event) {
        this.newPitchHeadline = event.target.value;
    }

    handleDescriptionChange(event) {
        this.newPitchDescription = event.target.value;
    }



handlesectionTitleChange(event) {
    const sectionId = parseInt(event.target.dataset.id, 10); // Convert to number
    if (!isNaN(sectionId)) {
        this.sections[sectionId - 1].title = event.target.value;
    }
}

    
    
handlesectionContentChange(event) {
    // Retrieve the content pair ID from the event
    const contentPairId = event.target.dataset.id;
    // Find the section that contains the content pair
    const section = this.sections.find(section => section.contentPairs.some(contentPair => contentPair.id === contentPairId));
    if (section) {
        // Find the content pair within the section
        const contentPair = section.contentPairs.find(cp => cp.id === contentPairId);
        if (contentPair) {
            // Update the content of the content pair
            contentPair.content = event.target.value;
        }
    }
}

handlesectionTaglineChange(event) {
    // Retrieve the content pair ID from the event
    const contentPairId = event.target.dataset.id;
    // Find the section that contains the content pair
    const section = this.sections.find(section => section.contentPairs.some(contentPair => contentPair.id === contentPairId));
    if (section) {
        // Find the content pair within the section
        const contentPair = section.contentPairs.find(cp => cp.id === contentPairId);
        if (contentPair) {
            // Update the tagline of the content pair
            contentPair.tagline = event.target.value;
        }
    }
}

    handleNext() {
        // Toggle the flag to switch to the next set of input fields
        console.log('Selected pitch name:', this.newPitchName);
        console.log('Selected pitch title:', this.newPitchTitle);
        console.log('Selected pitch headline:', this.newPitchHeadline);
        console.log('Selected pitch description:', this.newPitchDescription);
        console.log('Selected Pitch Layout Id:', this.selectedPitchLayoutId);
        console.log('Selected opp Id:', this.currentRecordId);
        this.showNextInputFields = true;
    }

    handleBack() {
        this.showNextInputFields = false;
    }

    savePitch() {
        // Add logic to save the pitch

        console.log("sections:", this.sections);

        this.closeModal();
        this.showNextInputFields = false;

        this.newPitchName = "";
        this.newPitchTitle = "";
        this.newPitchHeadline = "";
        this.newPitchDescription = "";
        this.selectedPitchLayoutId = "";
        this.currentRecordId = "";
    }
    
addsection() {
    const newsectionId = this.sections.length + 1;
    this.sections.push({
        id: newsectionId,
        title: '',
        contentPairs: [
            {
                // id: newsectionId + '-0', // Unique identifier for the content pair
                id: 1, 
                content: '',
                tagline: ''
            }
        ]
    });
}


addContentPair(event) {
    // Retrieve the id of the section to which the content pair will be added
    const sectionId = parseInt(event.target.dataset.sectionId, 10);

    // Find the section by its id
    const section = this.sections.find(section => section.id === sectionId);

    // If the section is found, add a new content pair to its contentPairs array
    if (section) {
        // Generate a unique ID for the new content pair
        // This ID is a combination of the section ID and the current length of the contentPairs array
        const newContentPairId = section.contentPairs.length + 1;

        // Add the new content pair with the unique ID
        section.contentPairs.push({
            id: newContentPairId, // Unique identifier for the content pair
            content: '', // Example value
            tagline: '' // Example value
        });
    }
}
    
removeContentPair(event) {
    // Retrieve the id of the content pair to be removed from the event
    // console.log("I reached this component !")
    const contentPairId = event.target.dataset.id;
    // console.log(event.target.dataset.id)
    // Find the section that contains the content pair
    const section = this.sections.find(section => section.contentPairs.some(contentPair => contentPair.id === contentPairId));
    console.log(section)
    // If the section is found, remove the content pair from its contentPairs array
    if (section) {
        section.contentPairs = section.contentPairs.filter(contentPair => contentPair.id !== contentPairId);
    }
}

    removesection(event) {
        // Retrieve the id of the section to be removed from the event
        const sectionId = event.target.dataset.id;

        // Filter out the section with the matching id from the sections array
        this.sections = this.sections.filter(section => section.id !== parseInt(sectionId));
    }
}