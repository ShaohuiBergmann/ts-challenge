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
        let mergedAddress = {
            district: addresses[0].district, //stb
            zip: addresses[0].zip, //plz
            city: addresses[0].city, //stt
            street: addresses[0].street, //str
            numbers: [] as any[], //hnr
        };

        let filterdAddr = addresses.filter((addr) => {
            return !isSameAddress(mergedAddress, addr);
        });
        console.log("filter", filterdAddr);

        const mergeAddrs = [mergedAddress];
        while (filterdAddr.length > 0) {
            mergedAddress = {
                district: filterdAddr[0].district, //stb
                zip: filterdAddr[0].zip, //plz
                city: filterdAddr[0].city, //stt
                street: filterdAddr[0].street, //str
                numbers: [] as any[], //hnr
            };
            mergeAddrs.push(mergedAddress);
            filterdAddr = filterdAddr.filter((addr) => {
                return !isSameAddress(mergedAddress, addr);
            });
        }

        mergeAddrs.forEach((addr) => {
            addresses.forEach((address) => {
                if (isSameAddress(addr, address))
                    addr.numbers.push(address.numbers);
                addr.numbers.sort((a, b) => {
                    a = parseInt(a);
                    b = parseInt(b);
                    return a - b;
                });
            });
        });

        console.log("merged", mergeAddrs);
        addresses.splice(0);
        console.log("addrs", addresses);
        mergeAddrs.sort((addr1, addr2) =>
            addr1.district.localeCompare(addr2.district)
        );
        mergeAddrs.forEach((addr) => {
            console.log(addr);
            addresses.push(addr);
        });
    }

    return {
        count: addresses.length,
        addresses,
        time: 0,
    };
}

export class InvalidParameters extends Error {}
