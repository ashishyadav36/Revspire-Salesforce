import { LightningElement, api } from 'lwc';

export default class PitchDialog extends LightningElement {
    @api showModal = false; // Controlled by the parent component
    newPitchName = ''; // Example property for the new pitch name

    closeModal() {
        console.log("Close modal is Pressed !")
        this.dispatchEvent(new CustomEvent('close'));
    }

    savePitch() {
        // Logic to save the new pitch
        // This might involve calling an Apex method to insert the new pitch into the database
        // After saving, you might want to close the modal and refresh the pitches list
        this.closeModal();
    }
}
