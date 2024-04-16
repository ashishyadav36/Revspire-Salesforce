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
    @track selections = [];

    @wire(getPitchLayouts)
        
    wiredPitchLayouts({data, error}) {
        if(data) {
            this.pitchLayouts = data.map(layout => ({label: layout.Name, value: layout.Id}));
        } else if(error) {
            // Handle error
        }
    }

    closeModal() {
        console.log("Array is here !",this.selections)
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

// handleSelectionTitleChange(event) {
//     const selectionId = event.target.dataset.id;
//     if (selectionId !== -1) {
//         this.selections[selectionId -1].title = event.target.value;
//     }
// }

handleSelectionTitleChange(event) {
    const selectionId = parseInt(event.target.dataset.id, 10); // Convert to number
    if (!isNaN(selectionId)) {
        this.selections[selectionId - 1].title = event.target.value;
    }
}

    
    
handleSelectionContentChange(event) {
    const selectionId = event.target.dataset.id;
    if (selectionId !== -1) {
        this.selections[selectionId -1].content = event.target.value;
    }
}

handleSelectionTaglineChange(event) {
    const selectionId = event.target.dataset.id;
    if (selectionId !== -1) {
        this.selections[selectionId -1 ].tagline = event.target.value;
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

        console.log("Selections:", this.selections);

        this.closeModal();
        this.showNextInputFields = false;

        this.newPitchName = "";
        this.newPitchTitle = "";
        this.newPitchHeadline = "";
        this.newPitchDescription = "";
        this.selectedPitchLayoutId = "";
        this.currentRecordId = "";
    }


addSelection() {
    const newSelectionId = this.selections.length + 1;
    this.selections.push({
        id: newSelectionId,
        title: '', // Example value
        content: '', // Example value
        tagline: '' // Example value
    });
}


    removeSelection(event) {
        // Retrieve the id of the selection to be removed from the event
        const selectionId = event.target.dataset.id;

        // Filter out the selection with the matching id from the selections array
        this.selections = this.selections.filter(selection => selection.id !== parseInt(selectionId));
    }
}
