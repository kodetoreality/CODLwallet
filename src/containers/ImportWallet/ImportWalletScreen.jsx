import { BackHandler, FlatList, Keyboard, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import colors from '../../assets/colors'
import Header from '../../components/common/Header'
import appConstant from '../../helper/appConstant'
import { hp, isIOS, normalize, wp } from '../../helper/responsiveScreen'
import Button from '../../components/common/Button'
import FontText from '../../components/common/FontText'
import { importWalletData } from '../../constants/data'
import Input from '../../components/common/Input'
import WalletCard from '../../components/WalletCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import Alert from '../../components/common/Alert'

export default function ImportWalletScreen({ navigation, route }) {
    const { t } = useTranslation();
    const { numberValue, ButtonValue, form } = route.params
    const cardRef = useRef([])
    const [btnValue, setBtnValue] = useState(appConstant.confirm)
    const [walletData, setWalletData] = useState(importWalletData)
    const [isEdit, setIsEdit] = useState(false)
    const [textIndex, setTextIndex] = useState(0)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertTitle, setAlertTitle] = useState('')
    const [alertMessage, setAlertMessage] = useState('')
    const walletcardData = numberValue && walletData.slice(0, numberValue)
    const regex = /^[A-Za-z]+$/;

    useEffect(() => {
        cardRef.current = cardRef?.current?.slice(0, walletData?.length);
    }, [walletData]);

    // useLayoutEffect(() => {
    //     setTimeout(() => {
    //         cardRef.current[0].focus();
    //     }, 1000);

    // }, []);

    useEffect(() => {
        if (form === appConstant.checkAgain) {
            setWalletData([...walletData]);
        }
        else {
            const walletdata = walletData.map(item => {
                return {
                    id: item?.id,
                    name: '',
                    number: item?.number
                };
            });
            setWalletData(walletdata)
        }
    }, []);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return async () => {
            BackHandler.removeEventListener('hardwareBackPress', backAction);
        };
    }, []);

    const keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setIsEdit(true)
        }
    );

    const keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            if (!walletcardData?.some((item) => !item.name)) {
                setBtnValue(appConstant.confirm)
                setIsEdit(false)
            }
            else {
                setBtnValue(appConstant.edit)
                setIsEdit(true)
            }
            setTextIndex(walletcardData.length)
        }
    );

    const handleConfirmClick = async () => {
        setBtnValue(appConstant.confirm)
        if (form === appConstant.recoveryCheck) {
            navigation.goBack()
        }
        else {
            await AsyncStorage.setItem('WalletData', JSON.stringify(walletcardData));
            navigation.navigate(appConstant.complateSeeds)
        }
    }

    const isValidate = () => {
        let errorStatus = true;
        walletcardData.forEach(item => {
            if (!regex.test(item.name)
            ) {
                setShowAlert(true)
                setAlertTitle(t("importWalletFailed"))
                setAlertMessage(t("importWalletError"))
                errorStatus = false;
            }
        });
        return errorStatus;
    };


    const handleProceedClick = () => {
        if (isValidate()) {
            setBtnValue(appConstant.confirm)
            setShowConfirm(true)
        }
    }

    const handleEditClick = () => {
        setIsEdit(true)
        cardRef.current[0].focus();
        setBtnValue(appConstant.edit)
    }

    const backAction = () => {
        if (form === appConstant.recoveryCheck) {
            navigation.goBack()
        }
        else {
            navigation.navigate(appConstant.attentionScreen2, {
                ButtonValue: ButtonValue,
                numberValue: numberValue,
                form: appConstant.importWallet
            });
        }
        return true;
    };

    const renderWalletData = (item, index) => {
        return (
            <View >
                <Input
                    autoFocus={isEdit}
                    withLeftIcon
                    editable={showConfirm && !isEdit ? false : true}
                    ref={el => cardRef.current[index] = el}
                    leftIcon={
                        <View style={[styles.numberContainer, { backgroundColor: item.name === '' ? colors.white : colors.red }]}>
                            <FontText name={"inter-bold"} size={normalize(12)} color={item.name === '' ? 'red' : 'white'}>
                                {item?.id}
                            </FontText>
                        </View>
                    }
                    placeholder={''}
                    value={item?.name}
                    autoCapitalize={'none'}
                    secureTextEntry={index == textIndex ? false : showConfirm ? false : true}
                    onSubmit={() => { walletData[index].name !== '' && index !== walletData.slice(0, numberValue).length - 1 ? cardRef.current[index + 1].focus() : Keyboard.dismiss() }}
                    onFocus={() => { cardRef.current[index].focus(), setTextIndex(index) }}
                    multiline={false}
                    autoCorrect={false}
                    inputStyle={[styles.textInput, { color: item.name == '' ? colors.white : colors.red }]}
                    onChangeText={text => {
                        walletData[index].name = text.toLowerCase();
                        setWalletData([...walletData]);
                    }}
                    keyboardType={'default'}
                    returnKeyType={'next'}
                    style={[styles.inputContainer, { backgroundColor: item.name == '' ? colors.red : colors.white }]}
                />
            </View>
        )
    }

    return (
        <View style={styles.container} >
            <Header title={t("importWallet")} showRightIcon RightIcon={'info'} showBackIcon onBackPress={backAction} statusBarcolor={colors.red} style={{ alignSelf: 'center', }} />
            <View style={styles.subContainer}>
                <WalletCard style={styles.walletCardContainer}
                    titleColor={'red'}
                    title={t("recoverySeeds")}
                    headerStyle={{ borderColor: colors.red }}
                    children={
                        <FlatList
                            data={numberValue && walletData.slice(0, numberValue)}
                            numColumns={3}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            keyExtractor={(item) => {
                                return item.id;
                            }}
                            renderItem={({ item, index }) => renderWalletData(item, index)}
                        />
                    }
                />
            </View>

            {showConfirm && <FontText name={"inter-regular"} size={normalize(20)} color={'white'} style={{ width: wp(90), alignSelf: 'center', }} pBottom={hp(2)} textAlign={'center'}  >
                {t("enterSeedsCorrectly")}
            </FontText>}
            {!showConfirm && <Button
                flex={null}
                disabled={walletcardData?.some((item) => !item.name)}
                height={hp(8.5)}
                bgColor={!walletcardData?.some((item) => !item.name) ? 'white' : ['red-open']}
                type="highlight"
                borderRadius={11}
                style={{ marginBottom: hp(2) }}
                onPress={handleProceedClick}
                buttonStyle={styles.button}>
                <FontText name={"inter-medium"} size={normalize(22)} color={!walletcardData?.some((item) => !item.name) ? "red" : 'white'}>
                    {t("proceed")}
                </FontText>
            </Button>
            }
            {showConfirm &&
                <>
                    <Button
                        flex={null}
                        height={hp(8.5)}
                        bgColor={!walletcardData?.some((item) => !item.name) && btnValue === appConstant.confirm ? 'white' : ['red-open']}
                        type="highlight"
                        borderRadius={11}
                        disabled={walletcardData?.some((item) => !item.name)}
                        style={{ marginBottom: hp(2) }}
                        onPress={handleConfirmClick}
                        buttonStyle={styles.button}>
                        <FontText name={"inter-medium"} size={normalize(22)} color={!walletcardData?.some((item) => !item.name) && btnValue === appConstant.confirm ? "red" : 'white'}>
                            {t("confirm")}
                        </FontText>
                    </Button>
                    <Button
                        flex={null}
                        height={hp(8.5)}
                        bgColor={btnValue === appConstant.edit ? 'white' : ['red-open']}
                        type="highlight"
                        borderRadius={11}
                        style={{ marginBottom: hp(3) }}
                        onPress={handleEditClick}
                        buttonStyle={styles.button}>
                        <FontText name={"inter-medium"} size={normalize(22)} color={btnValue === appConstant.edit ? "red" : 'white'}>
                            {t("edit")}
                        </FontText>
                    </Button>
                </>
            }
            <Alert
                show={showAlert}
                title={alertTitle}
                message={alertMessage}
                onConfirmPressed={() => {
                    setShowAlert(false)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.red,
        paddingHorizontal: wp(3.5),
    },
    subContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        width: wp(90),
        alignItems: 'center',
    },
    walletCardContainer: {
        backgroundColor: colors['red-open'],
        paddingTop: isIOS ? hp(2.5) : hp(3),
        paddingBottom: isIOS ? hp(1) : hp(1),
        paddingHorizontal: isIOS ? wp(4.5) : wp(3.5),
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderRadius: wp(2),
        width: wp(26),
        height: hp(4),
        flexDirection: 'row',
        marginBottom: hp(1),
        padding: 0,
        paddingHorizontal: wp(1.5),
        marginHorizontal: wp(1),
        paddingVertical: 0,
    },
    textInput: {
        fontSize: normalize(14),
        padding: 0,
        fontFamily: 'inter-regular',
        flex: 1,
    },
    numberContainer: {
        backgroundColor: colors.white,
        borderRadius: wp(1),
        height: hp(2.5),
        width: hp(2.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(1)
    },
})