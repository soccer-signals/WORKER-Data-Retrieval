

    const SportmonksApi = require("sportmonks").SportmonksApi;
    const apiKey = "e26BGpAseLRsnrB0jg01ZnSyZFeLNq8b8ruymhZvR5xe9zYRxKnUVJsd6f5p";
    const sportmonks = new SportmonksApi(apiKey);

import dataUpdates from  './../Database Models/Data-History'
    import User from './../Database Models/User'
    var _ = require('lodash')

    var livescoreParams = {
        localTeam: true,
        visitorTeam: true,
        odds: true,
        inplayOdds: true,
        stats: true,
        league: true,
    
    }
    
  
    function $time() {
    
            var today = new Date();
    
            var MS_PER_MINUTE = 60000;
            var fiveMinutesAgo = new Date(today - 5 * MS_PER_MINUTE);
            var tenMinutesAgo = new Date(today - 10 * MS_PER_MINUTE);
            var fifteenMinutesAgo = new Date(today - 15 * MS_PER_MINUTE);
            var fiveMinutesAgoParsed = fiveMinutesAgo.getFullYear() + '-' + (fiveMinutesAgo.getMonth() + 1) + '-' + fiveMinutesAgo.getDate() + " " + fiveMinutesAgo.getHours() + ":" + fiveMinutesAgo.getMinutes();
            var tenMinutesAgoParsed = tenMinutesAgo.getFullYear() + '-' + (tenMinutesAgo.getMonth() + 1) + '-' + tenMinutesAgo.getDate() + " " + tenMinutesAgo.getHours() + ":" + tenMinutesAgo.getMinutes();
            var fifteenMinutesAgoParsed = fifteenMinutesAgo.getFullYear() + '-' + (fifteenMinutesAgo.getMonth() + 1) + '-' + fifteenMinutesAgo.getDate() + " " + fifteenMinutesAgo.getHours() + ":" + fifteenMinutesAgo.getMinutes();
        
            return ({
                fiveMinutesAgoParsed,
                tenMinutesAgoParsed,
                fifteenMinutesAgoParsed
            })
    
    
    
    }


 function countriesDownload (cb) {
            return new Promise( (resolve) => {
                sportmonks.get("v2.0/countries", {
                    page: 1
                }).then(resp => {
                   var countries = resp.data
                    sportmonks.get("v2.0/countries", {
                        page: 2
                    }).then(resp => {
                        var a = countries.concat(resp.data)
    
                        sportmonks.get("v2.0/countries", {
                            page: 3
                        }).then(resp => {
                            var b = a.concat(resp.data)
    
                            sportmonks.get("v2.0/countries", {
                                page: 4
                            }).then(resp => {
                                var c = b.concat(resp.data)
    
                                sportmonks.get("v2.0/countries", {
                                    page: 5
                                }).then(resp => {
                                    var d = c.concat(resp.data)
                        
                                    countries = d
                                    resolve(countries)
    
                                })
                            })
    
                        })
    
                    })
    
                })
            })
        }
        var countries
       countriesDownload().then((resp)=>{
        countries = resp
        console.log("countries")
       }

       )
        export function refreshData () {
            return new Promise((resolve) =>{
                var finished = []
                var leagues = []
                var games = []
                var playingLeagues = []
           
           
                // Declare Time Variables
                var fiveMinutesAgo = $time().fiveMinutesAgoParsed
                var tenMinutesAgo = $time().tenMinutesAgoParsed
                var fifteenMinutesAgo = $time().fifteenMinutesAgoParsed
    
    
                sportmonks.get("v2.0/livescores/now", livescoreParams).then(resp => {
             
             var       apiData = resp.data
                    var dataFiveMinAgo = []
                    var dataTenMinAgo = []
                    var dataFifteenMinAgo = []
    
                    dataUpdates.find({
                        Date: fiveMinutesAgo
                    }, (err, resp) => {
                        dataFiveMinAgo = resp[resp.length - 1]
                        dataUpdates.find({
                            Date: tenMinutesAgo
                        }, (err, resp) => {
                            dataTenMinAgo = resp[resp.length - 1]
                            dataUpdates.find({
                                Date: fifteenMinutesAgo
                            }, (err, resp) => {
                                dataFifteenMinAgo = resp[resp.length - 1]
    
    
                                apiData.forEach((current_value, index) => {
    
                                    var gameOdds = []
                                    var bkmkrArr = []
                                    var inplayOdds = []
    
    
                                    if (dataFiveMinAgo != null || undefined) {
                                        var finallys = []
                                        dataFiveMinAgo.Data.forEach(league => {
                                            league.children.forEach(child => {
                                                if (child.id === current_value.id) {
                                                    finallys.push(_.pick(child,
                                                        'id',
                                                        'localTeam_stats',
                                                        'visitorTeam_stats'
                                                    ))
                                                }
                                            })
    
                                        })
                                    }
    
                                    if (dataTenMinAgo != null || undefined) {
                                        var finallys2 = []
                                        dataTenMinAgo.Data.forEach(league => {
                                            league.children.forEach(child => {
                                                if (child.id === current_value.id) {
                                                    finallys2.push(_.pick(child,
                                                        'id',
                                                        'localTeam_stats',
                                                        'visitorTeam_stats'
                                                    ))
                                                }
                                            })
    
                                        })
                                    }
    
                                    if (dataFifteenMinAgo != null || undefined) {
                                        var finallys3 = []
                                        dataFifteenMinAgo.Data.forEach(league => {
                                            league.children.forEach(child => {
                                                if (child.id === current_value.id) {
                                                    finallys3.push(_.pick(child,
                                                        'id',
                                                        'localTeam_stats',
                                                        'visitorTeam_stats'
                                                    ))
                                                }
                                            })
    
                                        })
                                    }
    
    
    
    
    
    
                                    current_value.odds.data.forEach(odds => {
                                        if (odds.name === "3Way Result") {
                                            gameOdds.push({
                                                    name: odds.name,
                                                    bookmakers: odds.bookmaker.data.filter(bookmaker => {
                                                        return bookmaker.name === "bet365" || bookmaker.name === "Betfair"
                                                    }).map(ofChosenBookmakers => {
                                                        return {
                                                            name: ofChosenBookmakers.name,
                                                            data: ofChosenBookmakers.odds.data.map(dataItem => {
                                                                return {
                                                                    "name": dataItem.label,
                                                                    "value": dataItem.value
                                                                }
                                                            })
    
                                                        }
                                                    })
    
                                                }
    
                                            )
                                        }
                                    })
                                    current_value.inplayOdds.data.forEach(inplayOdd => {
                                        if (inplayOdd.market_id === 1) {
                                            inplayOdds.push({
                                                inplayOdd
                                            })
                                        }
    
    
                                    })
    
    
    
                                    playingLeagues.push({
                                        "id": current_value.league.data.id,
                                        "Name": current_value.league.data.name,
                                        "Logo": current_value.league.data.logo_path,
                                        "Country": current_value.league.data.country_id
    
                                    })
                                    games.push({
                                        "id": current_value.id,
                                        "match": `${current_value.localTeam.data.name} VS ${current_value.visitorTeam.data.name}`,
                                        "time": current_value.time.minute,
                                        "league": _.pick(current_value.league.data,
                                            'id',
                                            'name',
                                            'country_id'
                                        ),
                                        "localTeam": {
                                            // data: _.pick(current_value.localTeam.data,
                                            //     'id',
                                            //     'name',
                                            //     'logo_path'
                                            // )
                                            data: current_value.localTeam.data
                                        },
                                        "visitorTeam": {
                                            // data: _.pick(current_value.visitorTeam.data,
                                            //     'id',
                                            //     'name',
                                            //     'logo_path'
                                            // )
                                            data: current_value.visitorTeam.data
                                        },
                                        "scores": {
                                            localteam_score: current_value.scores.localteam_score,
                                            visitorteam_score: current_value.scores.visitorteam_score
    
                                        },
    
                                        "localTeam_stats": current_value.stats.data[0],
                                        "visitorTeam_stats": current_value.stats.data[1],
                                        "odds": gameOdds,
                                        "liveOdds": inplayOdds,
                                        "fiveMinHistory": finallys,
                                        "TenMinHistory": finallys2,
                                        "fifteenMinHistory": finallys3,
    
                                    })
    
                                })
                                leagues = Array.from(new Set(playingLeagues.map(a => a.id)))
                                    .map(id => {
                                        return playingLeagues.find(a => a.id === id)
                                    })
                                leagues.forEach((league, index) => {
                                        
                                    finished.push({
                                            league: league.Name,
                                            id: league.id,
                              
                                            league_country: countries.filter(country => {return country.id === league.Country}),
                                           
    
                                            children: games.filter(game => {
    
                                                return game.league.id === league.id
                                            })
                                        }
    
                                    )
    
                                })
                                resolve({
                                    finished,
                                    games
                                })
                            });
                        });
                    });
                })
            })
        }

    
    
    
    
    
    
    
    

 



