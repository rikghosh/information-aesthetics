#!/usr/bin/env python
# encoding: utf-8
"""
scrape.py

Created by Christian Swinehart on 2017/10/11.
Copyright (c) 2017 Samizdat Drafting Co. All rights reserved.
"""

from __future__ import with_statement, division
import sys
import os
import json
import re
from pprint import pprint
from os.path import abspath, basename, dirname, exists
from collections import defaultdict as ddict, OrderedDict as odict
_root = dirname(abspath(__file__))
_mkdir = lambda pth: exists(pth) or os.makedirs(pth)

# raw-data.json is a local copy of:
# https://s3.amazonaws.com/goeventweb-static.greencopper.com/93cd0c02e2034b34ae636e27f36d81a7/northsidebrooklyn-2017/assets/widgets/artists/widget_items_eng.json

days = {'2017-06-08':0, '2017-06-09':1, '2017-06-10':2, '2017-06-11':3}
dates = {'2017-06-08':'Thursday, 8 June 2017', '2017-06-09':'Friday, 9 June 2017', '2017-06-10':'Saturday, 10 June 2017', '2017-06-11':'Sunday, 11 June 2017'}

def to24h(timestamp):
    m = re.match(r'(\d+):(\d+) ([AP]M)', timestamp)
    ampm = m.group(3)
    h, m = map(int, m.groups()[:-1])
    if h==12 and ampm=='AM':
        h = 0
    elif ampm=='PM':
        h += 12
    return h, m

def duration(startTime, endTime):
    mins = 60*endTime[0]+endTime[1]-(60*startTime[0]+startTime[1])
    while mins<0:
        mins += 60*24
    return mins

def main():
    shows = []
    db = json.load(open('raw-data.json'))[0]

    artist_names = set()
    venue_names = set()

    for item in db['artists'].values():
        for show in item['shows']:
            m = re.search(r'(\d+:\d\d [AP]M)\s+&gt;\s+(\d+:\d\d [AP]M)', show['formattedDate'])
            if not m:
                continue
            start, end = m.groups()
            startTime, endTime = map(to24h, m.groups())
            artist_names.add(item['title'])
            venue_names.add(show['venueTitle'])

            shows.append(dict(
                artist=item['title'],
                subtitle=filter(None, re.split(r'\s+[|x]\s+', item['subtitle'] or '')),
                venue=show['venueTitle'],
                schedule=dict(date=dates[show['date']], start=start, end=end),
                time=dict(day=days[show['date']],
                          startHour=startTime[0], startMinute=startTime[1],
                          endHour=endTime[0], endMinute=endTime[1],
                          duration=duration(startTime, endTime)
                )
            ))


    with file('shows.json','w') as f:
        json.dump(shows, f, indent=2)

    artists = odict()
    for name in sorted(artist_names):
        artists[name] = []
    for show in shows:
        artists[show['artist']].append(show)
    with file('artists.json','w') as f:
        json.dump(artists, f, indent=2)

    venues = odict()
    for name in sorted(venue_names):
        venues[name] = []
    for show in shows:
        venues[show['venue']].append(show)
    for venue, shows in venues.items():
        venues[venue] = sorted(shows, key=lambda x:[x['time']['day'], x['time']['startHour'], x['time']['startMinute']])
    with file('venues.json','w') as f:
        json.dump(venues, f, indent=2)

if __name__ == "__main__":
    main()
