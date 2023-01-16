class UI{
    constructor(){
        this.profile = document.getElementById('profile');
    }

    clearProfile(){
        this.profile.innerHTML = '';
    }

    async showProfile(user){
        this.profile.innerHTML = `
                <div class = "card card-body mb-3">
                    <div class="row">
                        <div class="col-md-9">
                            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
                            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
                            <span class="badge badge-success">Followers: ${user.followers}</span>
                            <span class="badge badge-info">Following: ${user.following}</span>
                            <br><br>
                            <ul class="list-group">
                                <li class="list-group-item">Company: ${user.company}</li>
                                <li class="list-group-item">Website / Blog: ${user.blog}</li>
                                <li class="list-group-item">Location: ${user.location}</li>
                                <li class="list-group-item">Member Since: ${user.created_at}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr>
                <div id=repos-root class = "card card-body mb-3"></div>
            `;
        return;
    }


    async showRepos(repos){
        const repoRoot = document.getElementById('repos-root');
        let reposHeader = document.createElement('h3');
        reposHeader.className = 'page-heading mb-3';
        var reposText = document.createTextNode('Repos:');
        reposHeader.appendChild(reposText);
        repoRoot.appendChild(reposHeader);

        for( const repo of repos){
            this.createRepoCard(repoRoot, repo);
        }
        return;
    }

    createRepoCard(repoRoot, repo){
        let repoCard = document.createElement('div');
        repoCard.classList.add('card','border-primary','mb-3');

        let repoCardHeader = document.createElement('div');
        repoCardHeader.classList.add('card-header');

        let repoAhref = document.createElement('a');
        repoAhref.setAttribute('href', repo.html_url);
        var repoText = document.createTextNode(repo.name);
        repoAhref.appendChild(repoText);
        repoCardHeader.appendChild(repoAhref);

        let repoCardBody = document.createElement('div');
        repoCardBody.classList.add('card-body');

        const table = document.createElement("table");
        const tableBody = document.createElement("tbody");
        
        let createdionDate = new Date(repo.created_at);
        let lastUpdateDate = new Date(repo.updated_at);
        tableBody.appendChild(this.createTableRow('Created: ', createdionDate.toLocaleString()));
        tableBody.appendChild(this.createTableRow('Last update: ', lastUpdateDate.toLocaleString()));
        tableBody.appendChild(this.createTableRowForEmail(repo.full_name));
        table.appendChild(tableBody);
        repoCardBody.appendChild(table);

        repoCard.appendChild(repoCardHeader);
        repoCard.appendChild(repoCardBody);
        repoRoot.appendChild(repoCard);

        return;
    }

    createTableRow(header, cellValue){
        const tableRow = document.createElement('tr');
        const tableHeader = document.createElement('th');
        tableHeader.setAttribute('scope', 'row');
        tableHeader.textContent = header;
        tableHeader.style.padding =  '0px 30px 0px 0px';

        const cell = document.createElement('td');
        cell.textContent = cellValue;
        tableRow.appendChild(tableHeader);
        tableRow.appendChild(cell);
        return tableRow;
    }

    
    createTableRowForEmail(repoFullName){
        const tableRow = document.createElement('tr');
        const tableHeader = document.createElement('th');
        tableHeader.setAttribute('scope', 'row');
        tableHeader.textContent = 'E-mail addresses';
        tableHeader.style.padding =  '0px 30px 0px 0px';

        const cell = document.createElement('td');
        cell.setAttribute('id', repoFullName);
        let button = document.createElement('button');
        let btnText = document.createTextNode('Get E-mail addresses');
        button.classList.add('btn','btn-primary');
        button.appendChild(btnText);
        button.setAttribute('onclick',`getEmailAddressesFromCommits("${repoFullName}")`);
        button.setAttribute('id', `${repoFullName}_mail_btn`);
        cell.appendChild(button);

        tableRow.appendChild(tableHeader);
        tableRow.appendChild(cell);
        return tableRow;
    }

    updateRepoInfo(repositoryFullName, resp){
        if(resp.message){ // in case any error
            if(resp.message === 'Git Repository is empty.'){
                this.updateRepoInfoWithMailAddresses(repositoryFullName, resp.message);
            }
            ui.showAlert(resp.message, 'alert alert-danger');
        } else {
            this.updateRepoInfoWithMailAddresses(repositoryFullName, resp);
        }
    }
    
    updateRepoInfoWithMailAddresses(repositoryFullName, contentToDisplay){
        let cell = document.getElementById(repositoryFullName);
        const btn = cell.childNodes[0];
        const div = document.createElement('div');
        div.style.padding = '20px 0px 0px 0px';;
        var ul = document.createElement('ul');
        if(typeof contentToDisplay === 'string'){
            // in this case the "contentToDisplay" contains an error message
            let errMsg = document.createTextNode(contentToDisplay);
            cell.replaceChild(errMsg, btn);
            return;
        }

        // "contentToDisplay" contains list of e-mail addresses
        contentToDisplay.forEach(addr => {
            let li = document.createElement('li');
            li.textContent = addr
            ul.appendChild(li);
        });
        div.appendChild(ul);
        cell.replaceChild(div, btn);
    }

    showAlert(message, className, timeOut = 3000){
        this.clearAlert();
        const div = document.createElement('div');
        div.className = className;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.serachContainer');
        const search = document.querySelector('.search');
        container.insertBefore(div, search);
        // Tiemout after 3 seconds (default) or after the received value
        setTimeout(() => this.clearAlert(), timeOut);
    }

    // Clear error message
    clearAlert(){
        const currentAlert = document.querySelector('.alert');
        if(currentAlert){
            currentAlert.remove();
        }
    }
}