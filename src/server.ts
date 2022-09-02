import axios from "axios";
import { AutoCompleteResponse, Address } from "./interfaces";

const BASE_URL =
    "https://geoportal.stadt-koeln.de/Finder/Lookup?filter=type:adr&query=";

export async function autoCompleteAddress(
    query: string
): Promise<AutoCompleteResponse> {
    // TODO: implement!
    const res = await axios(BASE_URL, {
        params: {
            query,
        },
    });

    if (typeof query !== "string") throw new InvalidParameters();

    const locs = res.data.locs as any[];

    let addresses = locs.map((loc) => {
        const fields = loc.fields;

        const address: Address = {
            district: fields.stb, //stb
            zip: fields.plz, //plz
            city: "Köln", //stt
            street: fields.str, //str
            numbers: fields.hnr, //hnr
        };

        return address;
    });

    const isSameAddress = (address1: Address, address2: Address) => {
        return (
            address1.district == address2.district &&
            address1.zip == address2.zip &&
            address1.street == address2.street
        );
    };

    if (addresses.length > 0) {
        const mergeAddrs = [];

        let toBeFilteredAddresses = addresses;

        while (toBeFilteredAddresses.length > 0) {
            let mergedAddress = {
                district: toBeFilteredAddresses[0].district,
                zip: toBeFilteredAddresses[0].zip,
                city: toBeFilteredAddresses[0].city,
                street: toBeFilteredAddresses[0].street,
                numbers: [] as any[],
            };

            mergeAddrs.push(mergedAddress);
            toBeFilteredAddresses = toBeFilteredAddresses.filter((addr) => {
                return !isSameAddress(mergedAddress, addr);
            });
        } //end of while loop

        mergeAddrs.forEach((uniqueAddress) => {
            addresses.forEach((address) => {
                if (isSameAddress(uniqueAddress, address))
                    uniqueAddress.numbers.push(address.numbers);
            }); //end of inner forEach
            uniqueAddress.numbers.sort((a, b) => {
                a = parseInt(a);
                b = parseInt(b);
                return a - b;
            }); //end of sort
        });

        addresses.splice(0);

        mergeAddrs.sort((addr1, addr2) =>
            addr1.district.localeCompare(addr2.district)
        );

        mergeAddrs.forEach((addr) => {
            console.log(addr);
            addresses.push(addr);
        });
    } // end of if(address.length > 0)

    return {
        count: addresses.length,
        addresses,
        time: 0,
    };
}

export class InvalidParameters extends Error {}
