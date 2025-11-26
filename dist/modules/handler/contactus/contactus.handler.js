"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contactus_repository_1 = __importDefault(require("../../repository/contactus/contactus.repository"));
const contactRepo = new contactus_repository_1.default();
class ContactHandler {
    // Handler methods for contact us functionality 
    async createContact(contactData) {
        const contact = await contactRepo.create(contactData);
        return contact;
    }
    async getAllContacts() {
        const contacts = await contactRepo.findAll();
        return contacts;
    }
    async getContactById(contactId) {
        const contact = await contactRepo.findById(contactId);
        return contact;
    }
    async updateContact(contactId, contactData) {
        const contact = await contactRepo.update(contactId, contactData);
        return contact;
    }
    async deleteContact(contactId) {
        const contact = await contactRepo.delete(contactId);
        return contact;
    }
}
exports.default = ContactHandler;
//# sourceMappingURL=contactus.handler.js.map