 
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAzBGYBOi1kKIoOIkwA5OnzbJWbuW16R3Y&libraries=places"></script>
 <script defer>
function attachAutocompleteToElement(querySelector) {
    console.log("loaded buddy!");
    let inputElement = document.querySelector(querySelector);
    if (inputElement) {
        let autocomplete = new google.maps.places.Autocomplete(inputElement, { types: ['geocode'] });
        autocomplete.setFields(['address_components']);

        autocomplete.addListener('place_changed', function() {
            let place = autocomplete.getPlace();

            let streetNumber = '';
            let streetName = '';
            let city = '';
            let state = '';
            let zipcode = '';

            for (let i = 0; i < place.address_components.length; i++) {
                let component = place.address_components[i];
                switch (component.types[0]) {
                    case 'street_number':
                        streetNumber = component.long_name;
                        break;
                    case 'route':
                        streetName = component.long_name;
                        break;
                    case 'locality':
                        city = component.long_name;
                        break;
                    case 'administrative_area_level_1':
                        state = component.short_name;
                        break;
                    case 'postal_code':
                        zipcode = component.long_name;
                        break;
                }
            }

            document.querySelector('input[name="contact.address1"]').value = streetNumber + ' ' + streetName;
            document.querySelector('input[name="contact.city"]').value = city;
            document.querySelector('input[name="contact.state"]').value = state;
            document.querySelector('input[name="contact.postal_code"]').value = zipcode;
        });
    } else {
        console.error("Element with ID " + querySelector + " not found.");
    }
}

function tryAttachAutocomplete(querySelector, retries = 3) {
    if (retries <= 0) {
        console.error("Failed to attach autocomplete after 3 attempts.");
        return;
    }

    let inputElement = document.querySelector(querySelector);
    if (inputElement) {
        attachAutocompleteToElement(querySelector);
    } else {
        console.warn(`Attempt failed. Retrying in 4000ms. Retries left: ${retries - 1}`);
        setTimeout(() => {
            tryAttachAutocomplete(querySelector, retries - 1);
        }, 4000);
    }
}

let querySelector = '[name="address"]';
tryAttachAutocomplete(querySelector, 6);



// this part keeps track of route changes so we can reattach the autocomplete to the address field
let currentURL = window.location.href;

setInterval(function() {
    if (currentURL !== window.location.href) {
        let querySelector = 'input[name="contact.address1"]';
        tryAttachAutocomplete(querySelector, 6);
        currentURL = window.location.href;
    }
}, 100); // Check every 100ms

console.log('routechange2.js loaded!');
</script>
