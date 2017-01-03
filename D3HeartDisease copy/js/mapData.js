var gblStates;
var abbrev = {
    Alabama            : 'AL',
    Alaska            : 'AK',
    Arizona            : 'AZ',
    Arkansas        : 'AR',
    California        : 'CA',
    Colorado        : 'CO',
    Connecticut     : 'CT',
    Delaware        : 'DE',
    Florida            : 'FL',
    Georgia            : 'GA',
    Hawaii            : 'HI',
    Idaho            : 'ID',
    Illinois        : 'IL',
    Indiana            : 'IN',
    Iowa            : 'IA',
    Kansas            : 'KS',
    Kentucky        : 'KY',
    Louisiana        : 'LA',
    Maine            : 'ME',
    Maryland        : 'MD',
    Massachusetts    : 'MA',
    Michigan        : 'MI-',
    Minnesota        : 'MN',
    Mississippi        : 'MS',
    Missouri        : 'MO',
    Montana            : 'MT',
    Nebraska        : 'NE',
    Nevada            : 'NV',
    'New Hampshire'    : 'NH',
    'New Jersey'    : 'NJ',
    'New Mexico'        : 'NM',
    'New York'       : 'NY',
    'North Carolina'    : 'NC',
    'North Dakota'    : 'ND',
    Ohio            : 'OH',
    Oklahoma        : 'OK',
    Oregon            : 'OR',
    Pennsylvania    : 'PA',
    'Rhode Island'    : 'RI',
    'South Carolina'    : 'SC',
    'South Dakota'    : 'SD',
    Tennessee        : 'TN',
    Texas            : 'TX',
    Utah            : 'UT',
    Vermont            : 'VT',
    Virginia        : 'VA',
    Washington        : 'WA',
    'West Virginia'    : 'WV',
    Wisconsin        : 'WI',
    Wyoming            : 'WY'
	};

d3.csv("smallData_OLD.csv",
	function(states) <!--method specifying datasource and action -->
	{
		gblStates = states;
//		alert('states loaded');
	}
)

 //Chooses the appropriate states based on the options selected from the  filters 
function filter(states) {
	// Get the combo box for the gender
	var genderCbx = document.getElementById("gender");

	// Gender
	var gender = genderCbx.options[genderCbx.selectedIndex].value;
	
	// Get the combo box for the race
	var raceCbx = document.getElementById("race");
	
	// Race
	var race = raceCbx.options[raceCbx.selectedIndex].value;
	
	// Get the combo box for the age group
	var ageCbx = document.getElementById("age_group");
	
	// Age Group
	var age = ageCbx.options[ageCbx.selectedIndex].value;

	// Get the combo box for the year
	//var yearCbx = document.getElementById("year");
	
	// Year
	//var year = yearCbx.options[yearCbx.selectedIndex].value;
	var year = $( "#slider" ).slider( "value" );

	function isValidState(line)
	{
		return (abbrev[line.State] != undefined);
	}
	
	function isValidGender(line)
	{
		return (gender == "All" || gender == line.Gender);
	}
	
	function isValidRace(line)
	{
		return (race == "All" || race == line.Race);
	}
	
	function isValidAgeGroup(line)
	{
		return (age == "All" || age == line["Ten-Year Age Groups"]);
	}
	
	function isValidYear(line)
	{
		return (year == "" || year == line.Year);
	}
	
	function isValidPopulation(line)
	{
		return (line.Population != "Not Applicable" && line.Population != "Suppressed");
	}
	
	
	function isValidDeath(line)
	{
		return (death = line["Deaths"]);
	
	}
	
	function aggregate(state,stateArray)
	{
		var state = {State: state, 
					 Population: 0,
					 Deaths: 0,
					 'Crude Rate' : 0.0};

		// Add filter-dependent options
		state.Gender = (gender == "")? "All" : gender;
		state.Race = (race == "")? "All" : race;
		state.AgeGroup = (age == "")? "All" : age;
		state.Year = (year == "")? "All" : year;

		for (i = 0; i < stateArray.length; i++)
		{
			state.Population += parseInt(stateArray[i].Population);
			state.Deaths += parseInt(stateArray[i].Deaths);
			state['Crude Rate'] += parseFloat(stateArray[i]['Crude Rate']);
		}
		
		return state;
	}
	
	var statesData = {};
	
	for (var i in states)
	{
		if (isValidState(states[i]))
		{
			if (!statesData[states[i].State])
			{
				statesData[states[i].State] = [];
			}
		
			var filteredStatesArray = statesData[states[i].State];
		
			if (isValidGender(states[i]) 
				&& isValidRace(states[i]) 
				&& isValidAgeGroup(states[i]) 
				&& isValidYear(states[i])
				&& isValidPopulation(states[i]))
			{
				filteredStatesArray.push(states[i]);
			}
		}
	}
	
	var filteredStates = [];
	for (var i in statesData)
	{
		filteredStates.push(aggregate(i,statesData[i]));
	}
	
	filteredStates.sort(function (a, b) { if (a.State < b.State) return -1; 
											if (a.State > b.State) return 1; 
												return 0; });
	return filteredStates;
}
