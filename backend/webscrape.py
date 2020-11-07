"""Webscrape Module"""

import pandas as pd
from bs4 import BeautifulSoup 
import requests
import urllib.request 

user_agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36 Edg/86.0.622.63'

def get_soup(link):
    link_request = urllib.request.Request(link, headers={'user-agent':user_agent})
    opened_request = urllib.request.urlopen(link_request)
    soup = BeautifulSoup(opened_request, 'lxml')
    return soup

def print_soup(link):
    soup = get_soup(link)
    print(soup)

def soupify(param):
    return BeautifulSoup(str(param), 'lxml')