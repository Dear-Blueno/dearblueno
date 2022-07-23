import axios from "axios";
import IEvent from "../types/IEvent";
import {
  failureResponse,
  IResponse,
  successfulResponse,
} from "./GatewayResponses";

export async function getEvents(page: number): Promise<IResponse<IEvent[]>> {
  try {
    const response = await axios.get(`/events?page=${page}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getAllEvents(page: number): Promise<IResponse<IEvent[]>> {
  // only for moderators! gets all events, regardless of approval or review status
  try {
    const response = await axios.get(`/events/all?page=${page}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getModFeedEvents(
  page: number
): Promise<IResponse<IEvent[]>> {
  // only for moderators! gets events that need moderation
  try {
    const response = await axios.get(`/events/mod-feed?page=${page}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function getEvent(id: string): Promise<IResponse<IEvent>> {
  try {
    const response = await axios.get(`/events/${id}`);
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function createEvent(
  eventName: string,
  eventDescription: string,
  startDate: Date,
  endDate: Date,
  location: string,
  contactEmail?: string,
  coverPicture?: string
): Promise<IResponse<IEvent>> {
  try {
    const response = await axios.post("/events", {
      eventName,
      eventDescription,
      startDate,
      endDate,
      location,
      contactEmail,
      coverPicture,
    });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function approveEvent(
  eventId: string,
  approved: boolean
): Promise<IResponse<IEvent>> {
  try {
    const response = await axios.put(`/events/${eventId}/approve`, {
      approved,
    });
    if (response.status === 200) {
      return successfulResponse(response.data);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function reactInterestedToEvent(
  eventId: string,
  interested: boolean
): Promise<IResponse<boolean>> {
  try {
    const response = await axios.put(`/events/${eventId}/interested`, {
      interested,
    });
    if (response.status === 200) {
      const data = response.data as { interested: boolean };
      return successfulResponse(data.interested);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}

export async function reactGoingToEvent(
  eventId: string,
  going: boolean
): Promise<IResponse<boolean>> {
  try {
    const response = await axios.put(`/events/${eventId}/going`, {
      going,
    });
    if (response.status === 200) {
      const data = response.data as { going: boolean };
      return successfulResponse(data.going);
    } else {
      return failureResponse(response.data as string);
    }
  } catch (error: unknown) {
    return failureResponse(error as string);
  }
}
