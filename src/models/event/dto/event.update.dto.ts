export class UpdateEventDto{
    eventName: string
    description: string
    organizer: string
    startDate: Date
    endDate: Date
    location: string
    emailCp: string
    phoneCp: string
    linkEvent: string
}

export class UpdateEventImageDto{
    image: string
}