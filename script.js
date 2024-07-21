document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.github.com/users/ErenAtasun/repos')
        .then(response => response.json())
        .then(data => {
            const projectList = document.getElementById('project-list');
            data.forEach(repo => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = repo.html_url;
                link.target = '_blank';
                link.textContent = repo.name;
                listItem.appendChild(link);
                projectList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching repos:', error));
});
