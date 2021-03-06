// Copyright (C) 2018, Zpalmtree
//
// Please see the included LICENSE file for more information.

import React from 'react';

import Realm from 'realm';

import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { deleteUserPinCode } from '@haskkor/react-native-pincode';

import { List, ListItem } from 'react-native-elements';

import { View, FlatList, Alert } from 'react-native';

import Config from './Config';
import Globals from './Globals';

import { navigateWithDisabledBack } from './Utilities';

/**
 * Fuck w/ stuff
 */
export class SettingsScreen extends React.Component {
    static navigationOptions = {
        title: 'Settings',
    };

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <List>
                <FlatList
                    data={[
                        {
                            title: 'Reset Wallet',
                            description: 'Discard sync data and resync from scratch',
                            icon: {
                                iconName: 'ios-search',
                                IconType: Ionicons,
                            },
                            /* TODO */
                            onClick: () => {},
                        },
                        {
                            title: 'Delete Wallet',
                            description: 'Delete your wallet to create or import another',
                            icon: {
                                iconName: 'delete',
                                IconType: AntDesign,
                            },
                            onClick: () => { deleteWallet(this.props.navigation) },
                        },

                    ]}
                    keyExtractor={item => item.title}
                    renderItem={({item}) => (
                        <ListItem
                            title={item.title}
                            subtitle={item.description}
                            leftIcon={
                                <View style={{width: 30, alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
                                    <item.icon.IconType name={item.icon.iconName} size={22} color={Config.theme.primaryColour}/>
                                </View>
                            }
                            onPress={item.onClick}
                        />
                    )}
                />
            </List>
        );
    }
}

/**
 *
 */
function deleteWallet(navigation) {
    Alert.alert(
        'Delete Wallet?',
        'Are you sure you want to delete your wallet? If your seed is not backed up, your funds will be lost!',
        [
            {text: 'Delete', onPress: () => {
                /* Disabling saving */
                clearInterval(Globals.backgroundSaveTimer);

                /* Delete pin code */
                deleteUserPinCode();

                /* Delete old wallet */
                Realm.deleteFile({});

                Globals.wallet.stop();

                Globals.wallet = undefined;
                Globals.pinCode = undefined;
                Globals.backgroundSaveTimer = undefined;

                /* And head back to the create screen */
                navigation.dispatch(navigateWithDisabledBack('Create'));
            }},
            {text: 'Cancel', style: 'cancel'},
        ],
    )
}
