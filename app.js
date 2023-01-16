// Init GitHub
const gitHub = new GitHub;
// Init UI
const ui = new UI;

//Search input
const userFld = document.getElementById('searchUser');
const searcBtn = document.getElementById('searchBtn');

// Event listener for Search event
searcBtn.addEventListener(
    'click', async (e) => {
        // get input text
        const userName = userFld.value;
        if(userName !== ''){

            // Fetch user info
            const userInfo = await gitHub.getUserInfo(userName);

            let errrMessage = userInfo.message;
            if(errrMessage){
                ui.clearProfile();
                if(errrMessage === 'Not Found'){
                    // Show alert
                    ui.showAlert('User not found', 'alert alert-danger');
                    return;
                } else if(errrMessage.includes('API rate limit exceeded')){
                    // Show alert
                    ui.showAlert('API rate limit exceeded... Please wait', 'alert alert-danger');
                    return;
                }
            }
            await ui.showProfile(userInfo);

            // Fetch repositories
            const repos = await gitHub.getRepositories(userName);

            // Update UI with the repositories
            ui.showRepos(repos);
            
        } else {
            // clear profile
            ui.clearProfile();
        }
    }
);

async function getEmailAddressesFromCommits(repositoryFullName){
    gitHub.getEmailAddressesFromCommits(repositoryFullName)
        .then(resp => {
            ui.updateRepoInfo(repositoryFullName, resp);
        });
}

async function getAPIRateLimitStatus(){
    const status =  await gitHub.getRateLimitStatus();
    var resetDate = new Date(status.reset*1000);
    // ui.showAlert('Alert with red background color', 'alert alert-danger');
    ui.showAlert(`Current status: ${status.remaining} / ${status.limit}.    \n\tRate will be resetted at: ${resetDate}`, 'alert alert-light', 10000);
}