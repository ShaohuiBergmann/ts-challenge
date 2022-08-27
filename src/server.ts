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
        console.log("fields,", fields);

        const address: Address = {
            district: fields.stb, //stb
            zip: fields.plz, //plz
            city: fields.stt, //stt
            street: fields.str, //str
            numbers: fields.hnr, //hnr
        };

        return address;
    });

    console.log("adresses", addresses);

    if (addresses.length > 1) {
        const addressesReduced = addresses.reduce(
            (groupedAddress: Object[], address) => {
                console.log("groupedAdress ", groupedAddress);
              Object.entries(address).forEach((attr
                 )=> {
                    const [key, value] = attr;
                   

              })
               
                return groupedAddress;
            },
            addresses
        );
    }

    return {
        count: locs.length,
        addresses,
        time: 0,
    };
}

export class InvalidParameters extends Error {}
