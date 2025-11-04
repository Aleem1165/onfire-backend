import { Request, Response } from "express";
import { User } from "../models/user";
import { Event } from "../models/event";
import { getEventPopulateOption } from "../utils/populateOptions";

export const createEvent = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { name, date, time, location, amount, about, cover } = req.body

        const user = await User.findById(_id);
        if (!user) {
            res.status(404).json({ success: false, message: "*User not found" });
            return;
        }

        if (user.role !== "trainer") {
            res.status(403).json({ success: false, message: "*Only trainers can create events" });
            return;
        }

        const event = await Event.create({
            name, date, time,
            location, amount, about,
            createdBy: _id, cover
        });

        await User.findByIdAndUpdate(
            _id,
            { $push: { eventsCreated: event._id } }
        );

        res.status(201).json({
            success: true, message: "Event created successfully", event
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
};

export const joinEvent = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { eventId } = req.params;

        const user = await User.findById(_id);
        if (!user) {
            res.status(404).json({ success: false, message: "*User not found" });
            return;
        }

        if (user.role !== "user") {
            res.status(403).json({ success: false, message: "*Only users can join events" });
            return;
        }

        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ success: false, message: "*Event not found" });
            return;
        }

        const alreadyJoined = event.participants.some(
            participantId => participantId.toString() === _id.toString()
        );
        if (alreadyJoined) {
            res.status(400).json({ success: false, message: "*You have already joined this event" });
            return;
        }

        await Promise.all([
            User.findByIdAndUpdate(
                _id,
                { $addToSet: { eventsJoined: eventId } }
            ),
            Event.findByIdAndUpdate(
                eventId,
                { $addToSet: { participants: _id } }
            )
        ]);

        res.status(200).json({
            success: true, message: "Event joined successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { eventId } = req.params;
        const { name, date, time, location, amount, about, cover } = req.body

        const event = await Event.findById(eventId);
        if (!event) {
            res.status(404).json({ success: false, message: "*Event not found" });
            return;
        }

        if (event.createdBy.toString() !== _id.toString()) {
            res.status(400).json({ success: false, message: "*You can only update your own event" });
            return;
        }

        event.name = name || event.name;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;
        event.amount = amount || event.amount;
        event.about = about || event.about;
        event.cover = cover || event.cover;

        await event.save();

        res.status(200).json({
            success: true, message: "Event updated successfully", event,
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
}

export const getEvents = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;

        if (eventId) {
            const event = await Event.findById(eventId).populate(getEventPopulateOption)

            if (!event) {
                res.status(404).json({ success: false, message: "*Event not found" });
                return;
            }

            res.status(200).json({ success: true, message: "Event fetched successfully", event });
            return;
        }

        const events = await Event.find().populate(getEventPopulateOption).sort({ createdAt: -1 });

        res.status(200).json({
            success: true, message: "Events fetched successfully", events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "*Internal server error",
        });
    }
};
