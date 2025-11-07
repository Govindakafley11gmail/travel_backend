import  ContactRepository  from "../../repository/contactus/contactus.repository";
const contactRepo = new ContactRepository();
class ContactHandler {
    // Handler methods for contact us functionality 
    async createContact(contactData: any) {
        const contact = await contactRepo.create(contactData);
        return contact;
    }
    async getAllContacts() {
        const contacts = await contactRepo.findAll();
        return contacts;
    }
    async getContactById(contactId: number) {
        const contact = await contactRepo.findById(contactId);
        return contact;
    }
    async updateContact(contactId: number, contactData: any) {
        const contact = await contactRepo.update(contactId, contactData);
        return contact;
    }
    async deleteContact(contactId: number) {
        const contact = await contactRepo.delete(contactId);
        return contact;
    }
}

export default ContactHandler;