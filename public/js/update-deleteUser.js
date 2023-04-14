const updateUserForm = document.querySelector('#updateUserForm');
const userName = document.querySelector('#userName');
const userProfession = document.querySelector('#userProfession');

const deleteUserAnchors = Array.from(document.querySelectorAll('.deleteUser'));


window.addEventListener('load', () => {

    (function () {
        try
        {
            updateUserForm.addEventListener('submit', function (event) {
                event.preventDefault();
            
                fetch(`/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userName : userName.value,
                        userProfession : userProfession.value
                    })
                })
                .then( response => response.ok ? window.location.href = response.url: console.log('Error in response'))
                .catch(err => console.log(err));
            });
        }
        catch(err) 
        {
            console.log('%c Currently not working in update Users', "color:blue; font-weight:bolder; font-family:comic sans ms; font-size: 18px;");
        }

        //delete User functionality

        deleteUserAnchors.forEach( aTag => aTag.addEventListener( 'click', async function ( event ){

            event.preventDefault();
            // console.log(this.id.substring( this.id.indexOf('r')+1, this.id.length))
            let deleteUserId = this.id.substring( this.id.indexOf('r')+1, this.id.length );
            try
            {
                const response = await fetch(`/users/${deleteUserId}`, {method : 'DELETE'});

                if(response.ok)
                window.location.url = response.url;
                window.location.reload();
            }
            catch(err)
            {
                console.log(err);
            }

        }));

    })();

});