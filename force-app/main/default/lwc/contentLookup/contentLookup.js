import { LightningElement, wire, track } from 'lwc';
import getContentDocuments from '@salesforce/apex/ContentSearchController.getContentDocuments';

export default class CustomLookupComp extends LightningElement {
    @track contentName = '';
    @track contentList = [];
    @track contentId;
    @track isshow = false;
    @track messageResult = false;
    @track showSearchedValues = false;
    @wire(getContentDocuments, { actName: '$contentName' })
    retrieveContentDocuments({ error, data }) {
        this.messageResult = false;
        console.log(this.contentName)
        if (data) {
            if (data.length > 0) {
                this.contentList = data;
                this.showSearchedValues = true;
                console.log(data)
            } else {
                this.contentList = [];
                this.showSearchedValues = false;
                if (this.contentName !== '') {
                    this.messageResult = true;
                }
            }
        } else if (error) {
            console.log("Error",error)
        }
    }

    handleClick(event) {
        this.messageResult = false;
    }

    handleKeyChange(event) {
        this.messageResult = false;
        this.contentName = event.target.value;
    }

    handleContentSelection(event) {
    // this.showSearchedValues = false;
    this.contentId = event.target.dataset.value;
    this.contentName = event.target.dataset.label;
    const selectedEvent = new CustomEvent('selected', { detail: this.contentId });
    this.dispatchEvent(selectedEvent);
        
    // Delay hiding the options box to allow the click event to complete
    setTimeout(() => {
        this.showSearchedValues = false;
    }, 1000);
    }

    // handleContentSelection(event) {
//     this.contentId = event.target.dataset.value;
//     this.contentName = event.target.dataset.label;
//     const selectedEvent = new CustomEvent('selected', { detail: this.contentId });
//     this.dispatchEvent(selectedEvent);
    
//     // Prevent the default behavior of the click event
//     event.preventDefault();
    
//     // Optionally, you can stop the event propagation to prevent it from bubbling up
//     // event.stopPropagation();

//     // Hide the options box
//     this.showSearchedValues = false;
// }


    handleOpenModal() {
        this.isshow = true;
    }

    handleCloseModal() {
        this.isshow = false;
    }

    handleUnselect() {
    this.contentId = null;
    this.contentName = '';
    this.contentList = [];
    this.showSearchedValues = false;
    this.messageResult = false;
    }

}
