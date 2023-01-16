class GitHub {
    constructor(){
        // this.client_id= '';      // read up from secure storage
        // this.client_secret= '';
        // this.repos_count = 5;
        this.repos_sort = 'created: asc';
    }

    async getUserInfo(userName){
        const profileResponse = await fetch(`https://api.github.com/users/${userName}`);
        // const profileResponse = await fetch(`https://api.github.com/users/${userName}?client_id=${this.client_id}&client_secret=${this.client_secret}`);
        const profile = await profileResponse.json();
        
        return profile;
    }

    async getRepositories(userName){
        const repoResponse = await fetch(`https://api.github.com/users/${userName}/repos?sort=${this.repos_sort}`);
        // const repoResponse = await fetch(`https://api.github.com/users/${userName}/repos?sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`);
        const repos = await repoResponse.json();
        
        return repos;
    }

    async getEmailAddressesFromCommits(repoFullName){
        const commitsResponse = await fetch(`https://api.github.com/repos/${repoFullName}/commits`);
        // const commitsResponse = await fetch(`https://api.github.com/repos/${repoFullName}/commits?client_id=${this.client_id}&client_secret=${this.client_secret}`);
        const commits = await commitsResponse.json();

        if(commits.message){
            return commits;
        }
        
        const emails = new Set();
        commits.forEach( commit => {
            const author = commit.commit.author.email;
            const committer = commit.commit.committer.email;
            if(author !== 'noreply@github.com' && !author.includes('@users.noreply.github.com')){
                emails.add(author);
            }
            if(committer !== 'noreply@github.com' && !committer.includes('@users.noreply.github.com')){
                emails.add(committer);
            }
        });

        return Array.from(emails);
    }

    async getRateLimitStatus(){
        const rateLimitResponse = await fetch(`https://api.github.com/rate_limit`);
        // const rateLimitResponse = await fetch(`https://api.github.com/rate_limit?client_id=${this.client_id}&client_secret=${this.client_secret}`);
        const rateLimitJSON = await rateLimitResponse.json();
        const rateLimit = rateLimitJSON.rate;
        var resetDate = new Date(rateLimit.reset*1000);
        console.log(`From the ${rateLimit.limit} requests you used until now ${rateLimit.used}. \n\tRemaining: ${rateLimit.remaining} \n\tRate will be resetted at: ${resetDate}`);
        return rateLimit;
    }
}