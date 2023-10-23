import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemListed, ActiveItem, ItemBought, ItemCanceled } from "../generated/schema";

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!itemListed){
    itemListed = new ItemListed(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }
  if (!activeItem) {
    activeItem = new ActiveItem(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  itemListed.nftAddress = event.params.nftAddress
  activeItem.nftAddress = event.params.nftAddress

  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId

  itemListed.price = event.params.price
  activeItem.price = event.params.price

  activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")

  itemListed.save()
  activeItem.save()
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  if(!itemCanceled) {
    itemCanceled = new ItemCanceled(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  }

  itemCanceled.seller = event.params.seller
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId
  // it's like a burner address i.e which dosent exist, its a way to know that the buyer i.e the buyer address is not there anymore
  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")

  itemCanceled.save()
  activeItem!.save()
}

export function handleItemBought(event: ItemBoughtEvent): void {
  // Save that event in our graph
  // update our activeitems

  // get or create an itemlisted object
  // each item needs a unique Id

  // ItemBoughtEvent: Just the raw event
  // ItemBoughtObject: What we save 

  // Here we want to create an ItemBoughtObject
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  // note that the id we use looks the same for itemBought and activeItem but it is of different types for itemBought and activeItem
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if(!itemBought){
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  // ! --> means we tell typescript that we will have an activeItem
  activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
}

// We created a function that will get a unique Id
function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
}
