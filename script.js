var guestConfirmations;
var guestCode;

function goBack() {
    document.getElementById("invitation__box").style.display = "grid";

    document.getElementById("confirmation__box").style.display = "none";
    document.getElementById("confirmation__box").innerHTML = ""; // Limpiar el contenido
}

async function handleCheckboxChange(name, isChecked) {

    
    const guest = guestConfirmations.find(item => item.name === name)
    
    if (!guest) {
        alert("Vuelve a intentarlo...");
        window.location.reload();
    }

    guest.confirmation = isChecked;
    
    const data = { confirmations: guestConfirmations }

    document.getElementById("loader").style.display = "flex";
    
    fetch(`https://us-central1-ivy-party.cloudfunctions.net/api/guests/${guestCode}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        } 
    })
        .then(response => {

            document.getElementById("loader").style.display = "none";

            if (response.ok) {
                document.getElementById("invitation__box").style.display = "none";
            } else {
                alert("Vuelve a intentarlo...");
                window.location.reload();
            }
        })
        .catch(error => {
            console.error(error.message);
            document.getElementById("loader").style.display = "none";
        });
}


document.addEventListener('DOMContentLoaded', function () {
    const curl = document.querySelector('.card__curl');
    const card = document.querySelector('.card');

    curl.addEventListener('click', function () {
        card.classList.toggle('open');
    });

    const confirmationButton = document.getElementById('confirmationButton');

    const pastelColors = [
        "rgba(255, 179, 186, 0.75)",
        "rgba(255, 172, 77, 0.75)",
        "rgba(186, 255, 201, 0.75)",
        "rgba(186, 225, 255, 0.75)",
        "rgba(204, 186, 255, 0.75)",
        "rgba(255, 186, 220, 0.75)"
    ];

    const pastelColorsCopy = [...pastelColors]

    confirmationButton.addEventListener('click', function () {
        let userInput = prompt("Por favor, ingresa el código de invitación:");
        userInput = userInput ? userInput.toUpperCase() : '';

        guestCode = userInput

        if (userInput) {
            userInput.toUpperCase()

            document.getElementById("loader").style.display = "flex";

            fetch(`https://us-central1-ivy-party.cloudfunctions.net/api/guests/${userInput}`)
                .then(response => {

                    document.getElementById("loader").style.display = "none";

                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Código no válido");
                    }
                })
                .then(data => {
                    document.getElementById("invitation__box").style.display = "none";

                    let confirmationBox = document.getElementById("confirmation__box");
                    confirmationBox.style.display = "block";

                    let guestList = "<span class='rainbow-text'>Invitados</span>"
                    guestList += `<p>Palomea cada invitado para confirmar su asistencia 🥳.</p><ul>`;

                    guestConfirmations = data

                    guestConfirmations.forEach(invitado => {

                        if (pastelColorsCopy.length === 0) {
                            pastelColorsCopy = [...pastelColors];
                        }

                        const randomIndex = Math.floor(Math.random() * pastelColorsCopy.length);

                        const color = pastelColorsCopy.splice(randomIndex, 1)[0];

                        guestList += `<li style="background-color: ${color}"><input type="checkbox" onchange="handleCheckboxChange('${invitado.name}', this.checked)" ${invitado.confirmation ? 'checked' : ''}> ${invitado.name}</li>`;
                    });

                    guestList += "</ul>";
                    guestList += '<button class="rainbow" onclick="goBack()">Confirmar</button>';

                    
                    confirmationBox.innerHTML = guestList;

                })
                .catch(error => {
                    console.error(error.message);
                    document.getElementById("loader").style.display = "none";
                });
        }
    });
});

(function () {

})();

