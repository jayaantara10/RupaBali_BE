import { ArtworkStatus } from "src/common/enum/artworkStatus.enum"

export class UpdateArtworkDto{
    title: string
    artistName: string
    artworkTypeId: string
    description: string
    value: string
    artworkStatus: ArtworkStatus
    auctionLink: string
    creationDate: Date
    function: string
    isScared: boolean
    dimensionHight: number
    dimensionWidth: number
    dimensionThickness: number
    artworkCertificate: string
}

export class UpdateArtworkImageDto{
    image: string
}

export class UpdateArtworkVideoDto{
    artworkVideo: string
}

export class UpdateArtworkLocationDto{
    latitude: number
    longitude: number
}

export class UpdateArtworkCertificateDto{
    artworkCertificate: string
}

