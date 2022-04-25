import { countries } from './world';
import { country_subdivisions } from './subdivisions';


function search_country(query: { id?: string, alpha2?: string, alpha3?: string }) {

    // if argument is not valid return false
    if (undefined === query.id && undefined === query.alpha2 && undefined === query.alpha3) return undefined;

    // iterate over the array of countries
    return countries.filter(function (country: any) {
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

export { countries, country_subdivisions, search_country }