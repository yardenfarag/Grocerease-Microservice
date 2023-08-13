export interface Market {
    _id?: string
    loc: { type: string, coordinates: [number, number] }
    branch_brand: string
    branch_name: string
    branch_id: string
    imgUrl: string
    timestamp: string
    products?: Array<{
        PriceUpdateDate: string
        ItemCode: string
        ItemType: string
        ItemName: string
        ManufactureName: string
        ManufactureCountry: string
        ManufactureItemDescription: string
        UnitQty: string
        Quantity: string
        UnitMeasure: string
        BisWeighted: string
        QtyInPackage: string
        ItemPrice: string
        UnitOfMeasurePrice: string
        AllowDiscount: string
        itemStatus: string
        LastUpdateDate: string
        LastUpdateTime: string
    }>
}