import { ArtworkStatus } from "src/common/enum/artworkStatus.enum"

export class CreateArtworkDto{
    title: string
    artistName: string
    artworkTypeId: string
    description: string
    image: string
    value: string
    artworkStatus: ArtworkStatus
    auctionLink: string
    creationDate: Date
    function: string
    isScared: boolean
    dimensionHight: number
    dimensionWidth: number
    dimensionThickness: number
    userId: string
}