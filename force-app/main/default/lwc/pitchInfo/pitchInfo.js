import { LightningElement, api, wire, track } from 'lwc';
import queryPitchNames from '@salesforce/apex/OpportunityPitchController.queryPitchNames';
import OPPORTUNITY_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import LAYOUT_NAME_FIELD from '@salesforce/schema/RevSpire_Pitch_Layout__c.Name';
import { getRecord } from 'lightning/uiRecordApi';

export default class PitchInfo extends LightningElement {
    @api recordId; 
    @track showModal = false;
    @api currentRecordId; // Expose currentRecordId
    @api opportunityName; // Expose opportunityName
    layoutName;
    pitches = [];

    connectedCallback() {
        this.currentRecordId = this.recordId;
        this.loadData();
    }

    isDisabled = true; // Set this based on your logic to enable/disable input
    isPitchAvailable = false; // Flag to check if pitch data is available

    loadData() {
        queryPitchNames({ opportunityId: this.currentRecordId })
            .then(result => {
                this.pitches = result.map(pitch => ({
                    name: pitch.Name,
                    opportunityId: pitch.revspiredemoani__Opportunity__c,
                    layoutId: pitch.revspiredemoani__RevSpire_Pitch_Layout__c,
                    title: pitch.revspiredemoani__Title__c,
                    headline: pitch.revspiredemoani__Headline__c,
                    active: pitch.revspiredemoani__Active__c,
                    id: pitch.Id,
                    description: pitch.revspiredemoani__Description__c
                }));

                // console.log('Fetched pitches:', this.pitches);
                this.isPitchAvailable = this.pitches.length > 0; // Set isPitchAvailable based on whether pitches array is empty or not
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    @wire(getRecord, { recordId: '$recordId', fields: [OPPORTUNITY_NAME_FIELD] })
    wiredOpportunity({ error, data }) {
        if (data) {
            this.opportunityName = data.fields.Name.value;
            // console.log("Opportunity Name: ", this.opportunityName)
        } else if (error) {
            console.error('Error fetching opportunity name:', error);
        }
    }

    get layoutId() {
        // Logic to get the layout ID from the pitches data
        return this.pitches.length > 0 ? this.pitches[0].layoutId : null;
    }

    @wire(getRecord, { recordId: '$layoutId', fields: [LAYOUT_NAME_FIELD] })
    wiredLayout({ error, data }) {
        if (data) {
            this.layoutName = data.fields.Name.value;
        } else if (error) {
            console.error('Error fetching layout name:', error);
        }
    }

    handleOpenModal() {
        this.showModal = true;
    }

    handleCloseModal() {
        this.showModal = false;
    }

}
