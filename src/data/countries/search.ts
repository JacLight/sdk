import { countries_translations } from './countries_translations';
import { countries } from './countries';
import { languages } from './languages';


export function search_country(query: { id?: string, alpha2?: string, alpha3?: string }) {

    // if argument is not valid return false
    if (undefined === query.id && undefined === query.alpha2 && undefined === query.alpha3) return undefined;

    // iterate over the array of countries
    return countries_translations.filter(function (country: any) {
        // return country's data if
        return (
            // we are searching by ID and we have a match
            (undefined !== query.id && parseInt(country.id, 10) === parseInt(query.id, 10))
            // or we are searching by alpha2 and we have a match
            || (undefined !== query.alpha2 && country.alpha2 === query.alpha2.toLowerCase())
            // or we are searching by alpha3 and we have a match
            || (undefined !== query.alpha3 && country.alpha3 === query.alpha3.toLowerCase())
        )

        // since "filter" returns an array we use pop to get just the data object
    }).pop()

}

export const getCurrencies = (): string[] => {
    const tempArray = Object.values(countries).filter(country => country.currency.length > 0).map(country => (country.currency[0]))
    return Array.from(new Set(tempArray));
}

export const getLanguages = (): { value: string, label: string }[] => {
    const tempArray = Object.values(countries).filter(country => country.languages.length > 0).map(country => country.languages[0])
    const dedupArray = Array.from(new Set(tempArray));
    return dedupArray.map((item: string) => {
        const langName = languages[item] ? languages[item].name : item
        return { value: item, label: langName }
    })
} 
