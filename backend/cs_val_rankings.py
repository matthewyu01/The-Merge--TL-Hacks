import pandas as pd
import json
import webscrape as WS

def valorant_rankings():
    url = 'https://www.thespike.gg/rankings'
    val_soup = WS.get_soup(url)

    na_id = "regional_ranking_listing_1"
    eu_id = 'regional_ranking_listing_2'
    asia_id = 'regional_ranking_listing_3'
    return [val_pandas(val_soup,na_id), val_pandas(val_soup,eu_id), val_pandas(val_soup,asia_id)]


def val_pandas(soup,region_id):
    rankings = soup.find('ul', id = region_id)
    rankings_soup = WS.soupify(rankings)
    teams = rankings_soup.find_all('div', class_ = "team-name")
    points = rankings_soup.find_all('div', class_ = "ranking-points")

    df = pd.DataFrame(columns = ["Ranking", "Team", "Points"])

    for index, (team, team_points) in enumerate(zip(teams,points)):
        points_txt = team_points.text.strip()
        end_index = points_txt.find('p')
        df.loc[index] = index+1, str(team.text).strip(), points_txt[:end_index]
    return df


def csgo_rankings():
    url = 'https://www.hltv.org/ranking/teams'
    soup = WS.get_soup(url)
    teams = soup.find_all('span', class_ = "name")
    points = soup.find_all('span', class_ = "points")

    df = pd.DataFrame(columns = ["Ranking", "Team", "Points"])
    for index, (team, team_points) in enumerate(zip(teams,points)):
        df.loc[index] = index+1, str(team.text), str(team_points.text[1:-8])
    return df


def rankings_to_json():
    csgo_rankings().to_json('cs_rankings.json', orient="records")
    csgo_rankings().to_json('val_rankings.json', orient="records")

rankings_to_json()