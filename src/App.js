import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import { ListItem } from 'react-native-elements';

export default function App(props) {

    const [people, setPeople] = useState([]);
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        login("demo", "demo", "product");
    }, [])

    const login = async (username, password, subdomain) => {
        const res = await axios.post("https://api.breezechms.com/api/v2/auth/login", {
            username: username,
            password: password,
            subdomain: subdomain
        },
            {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        );
        setAccessToken(res.data.access_token);
    }

    useEffect(() => {
        getPeople();
    }, [accessToken])

    const getPeople = async () => {
        let peopleArray = [];
        try {
            const response = await axios.get("https://api.breezechms.com/api/v2/people?sort=[last_name:asc,first_name:asc]&filter[is_archived:eq:boolean]=false", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            response.data.data.forEach((person, index) => {
                peopleArray.push(person);
            });

            setPeople(peopleArray);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Directory</Text>
                {people.map((person, index) => {
                    return (
                        <ListItem
                            key={index}
                            leftAvatar={{ source: { uri: `https://files.breezechms.com/${person.person_details.profile_picture}` } }}
                            title={person.person_details.name.first + " " + person.person_details.name.last}
                            style={styles.listItem}
                            containerStyle={styles.listItemContainer}
                            titleStyle={styles.listItemTitle}
                        />
                    )
                })}
                <StatusBar style="auto" />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333'

    },
    scrollContainer: {
        backgroundColor: '#333'
    },
    header: {
        marginTop: 50,
        marginLeft: 30,
        marginBottom: 20,
        fontSize: 25,
        fontFamily: "Helvetica",
        color: "#eee"
    },
    listItem: {
        marginBottom: 15,
    },
    listItemContainer: {
        backgroundColor: "#555",
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10
    },
    listItemTitle: {
        color: "#bbb",
        fontFamily: "Helvetica"
    }
});

