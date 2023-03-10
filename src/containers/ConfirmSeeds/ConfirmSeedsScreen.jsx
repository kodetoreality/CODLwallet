import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'
import { confirmSeedsData } from '../../constants/data'
import { hp, normalize, wp } from '../../helper/responsiveScreen'
import colors from '../../assets/colors'
import appConstant from '../../helper/appConstant'
import FontText from '../../components/common/FontText'
import Button from '../../components/common/Button'
import WalletCard from '../../components/common/WalletCard'
import Header from '../../components/common/Header'
import { useSelector } from 'react-redux'

export default function ConfirmSeedsScreen(props) {
    const { navigation } = props
    const [numberValue, setNumberValue] = useState()
    const [numberIndex, setNumberIndex] = useState(0)
    const { confirmIndex, confirmWords } = useSelector((state) => state.auth)

    const handleConfirmClick = () => {
        if (numberValue == confirmIndex) {
            // Alert.alert('You have confirmed.')
            navigation.navigate(appConstant.complateSeeds)
        } else {
            Alert.alert('The word is not corrected.')
        }
    }

    const handleBackClick = () => {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Header title={appConstant.confirmSeeds} showRightIcon RightIcon={'info'} showBackIcon onBackPress={handleBackClick} />
            <View style={styles.subContainer}>
                <WalletCard style={styles.walletCardContainer}
                    title={`${confirmIndex}st seed`}
                    headerStyle={{ borderColor: colors.black }}
                    titleColor={'black'}
                    children={
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={styles.numberWiew}>
                                <FontText name={"inter-bold"} size={normalize(22)} color={'black'}>
                                    {confirmIndex}
                                </FontText>
                            </View>
                            {confirmWords.map((item, index) => {
                                return (
                                    <TouchableOpacity key={Number(index)} style={[styles.numberContainer, { backgroundColor: Number(index) === numberIndex ? colors.white : colors.black }]} onPress={() => {
                                        setNumberValue(item?.number)
                                        setNumberIndex(Number(index))
                                    }}>
                                        <FontText name={"inter-regular"} size={normalize(16)} color={Number(index) === numberIndex ? "black" : 'white'}>
                                            {item?.name}
                                        </FontText>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    }
                />

            </View>
            <Button
                flex={null}
                height={hp(6.5)}
                width="90%"
                type="highlight"
                borderRadius={11}
                bgColor="white"
                onPress={handleConfirmClick}
                style={styles.button}>
                <FontText name={"inter-medium"} size={normalize(16)} color="black">
                    {appConstant.confirm}
                </FontText>
            </Button>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.black,
        flex: 1,
        alignItems: 'center',
    },
    subContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(70)
    },
    button: {
        backgroundColor: colors.white,
        position: 'absolute',
        bottom: hp(4),
        alignItems: 'center',
    },
    walletCardContainer: {
        backgroundColor: colors.gray,
        bottom: hp(1.5),
        width: wp(95),
        paddingBottom: hp(2.5),
        paddingTop: hp(3),
    },
    numberWiew: {
        backgroundColor: colors.white,
        height: hp(6),
        width: wp(14),
        borderRadius: wp(2),
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberContainer: {
        backgroundColor: colors.black,
        borderRadius: wp(2),
        paddingHorizontal: wp(2),
        height: hp(6),
        width: wp(22),
        justifyContent: 'center',
        alignItems: 'center',
    },
})