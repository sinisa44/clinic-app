
import {User} from '../models/User';
import {EventModel} from '../models/Event';
import { connectToMongo } from "../lib/database";
import { faker } from '@faker-js/faker';
import { addMinutes } from "date-fns";
import dotenv from 'dotenv';

enum UserRole {
    doctor = 'doctor',
    patient = 'patient'
}


dotenv.config()
const seed = async() => {
    connectToMongo();

   
    try{
        await User.deleteMany({});
        await EventModel.deleteMany({});

        for (let i = 0; i < 2; i++) {
            const user = await User.create({
                username: faker.person.fullName(),
                password: '123',
                role: faker.helpers.enumValue(UserRole),
                timezone: 'UTC'
            });

            
            const fakerTime = faker.date.future();

            const events = await EventModel.create({
                title: faker.lorem.sentence(),
                startTime: fakerTime,
                endTime: addMinutes(fakerTime, 30),
                patientId: user._id,
                doctorId: user._id
            });

            console.log('seeded', user, events);
        }
    } catch (error) {
        console.error(`seeding error`,error);   
    }

    process.exit(0);
}

export default seed();