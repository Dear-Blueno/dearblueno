export default interface IEvent {
  _id: string;
  eventName: string;
  eventDescription: string;
  startDate: string; // ISO-8601-formatted date
  endDate: string; // ISO-8601-formatted date
  location: string;
  contactEmail?: string;
  coverPicture?: string;
  approved: boolean;
  needsReview: boolean;
  approvedBy?: string;
  interested: string[];
  going: string[];
  postTime: string; // ISO-8601-formatted date
  approvedTime?: string; // ISO-8601-formatted date
  notificationSent: boolean;
}
