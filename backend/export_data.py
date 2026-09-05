import os
import json
import requests
from datetime import datetime, timedelta, timezone
from urllib.parse import quote

# Token atualizado para a nova nomenclatura
TOKEN = os.getenv('IHC_GITHUB_TOKEN')
REPO = "Interacao-Humano-Computador/2026.2-Grupo02"
BASE_URL = f"https://api.github.com/repos/{REPO}"
HEADERS = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json"}

TEAM_MEMBERS = [
    "andreozzi",
    "darkymeubem",
    "delvale412"
]

def fetch_all_pages(endpoint):
    all_data = []
    page = 1
    while True:
        separator = '&' if '?' in endpoint else '?'
        url = f"{BASE_URL}/{endpoint}{separator}per_page=100&page={page}"
        response = requests.get(url, headers=HEADERS)
        if response.status_code != 200:
            break
        data = response.json()
        if not data:
            break
        all_data.extend(data)
        if len(data) < 100 or page > 50:
            break
        page += 1
    return all_data

def main():
    print("Iniciando extração de dados do IHC Grupo 2...")
    
    branches = fetch_all_pages("branches")
    
    all_commits_raw = []
    for branch in branches:
        branch_name = quote(branch['name'])
        commits = fetch_all_pages(f"commits?sha={branch_name}")
        all_commits_raw.extend(commits)
        
    unique_commits = {}
    # Data de corte: 1 de setembro de 2026 (tudo do mês 8 para trás será ignorado)
    DATA_CORTE = datetime(2026, 9, 1, 0, 0, 0, tzinfo=timezone(timedelta(hours=-3)))

    for c in all_commits_raw:
        if 'sha' in c:
            author_login = c.get('author', {}).get('login') if c.get('author') else None
            
            if author_login in TEAM_MEMBERS:
                commit_date_str = c['commit']['author']['date']
                commit_date = datetime.fromisoformat(commit_date_str.replace('Z', '+00:00'))
                
                # Só aceita commits a partir de setembro de 2026
                if commit_date >= DATA_CORTE:
                    unique_commits[c['sha']] = c

    all_commits = sorted(list(unique_commits.values()), key=lambda x: x['commit']['author']['date'], reverse=True)
    
    all_issues_raw = fetch_all_pages("issues?state=all")
    issues = []
    for i in all_issues_raw:
        if 'pull_request' in i:
            continue
            
        user_login = i.get('user', {}).get('login')
        if user_login in TEAM_MEMBERS:
            issues.append(i)
    
   # Configura o fuso horário para Brasília (UTC-3)
    fuso_br = timezone(timedelta(hours=-3))

    data_package = {
        "generated_at": datetime.now(fuso_br).strftime("%d/%m/%Y %H:%M"),
        "team_members": TEAM_MEMBERS,
        "raw_commits": all_commits,
        "raw_issues": issues
    }
    
    output_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dados.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data_package, f, ensure_ascii=False)
        
    print(f"Sucesso! {len(all_commits)} commits e {len(issues)} issues processadas.")

if __name__ == "__main__":
    main()