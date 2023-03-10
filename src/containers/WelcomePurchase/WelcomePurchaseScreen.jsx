import { Keyboard, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/common/Header'
import colors from '../../assets/colors'
import appConstant from '../../helper/appConstant'
import { hp, normalize, wp } from '../../helper/responsiveScreen'
import FontText from '../../components/common/FontText'
import SvgIcons from '../../assets/SvgIcons'
import Input from '../../components/common/Input'
import WalletCard from '../../components/common/WalletCard'
import ToggleSwitch from 'toggle-switch-react-native'
import Button from '../../components/common/Button'
import { useSelector } from 'react-redux'

export default function WelcomePurchaseScreen({ navigation }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)
    const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const { user } = useSelector((state) => state.auth)

    const keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setIsEnabled(true)
        }
    );
    const keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setIsEnabled(false)
        }
    );

    const onSubmitPin = () => {
        // navigation.navigate(appConstant.main, {
        //     hidden: isEnabled
        // })
    }

    const handleEnterClick = () => {
        // navigation.navigate(appConstant.main, {
        //     hidden: isEnabled
        // })


    }

    return (
        <View style={styles.container}>
            <Header showRightIcon RightIcon={'info'} title={appConstant.welcome} />
            <View style={styles.subContainer}>
                <TouchableOpacity style={styles.buttonConatiner}>
                    <FontText size={normalize(22)} color={'white'} name={'inter-regular'}>
                        {user?.username}
                    </FontText>
                    <SvgIcons.RightBackArrow height={hp(3)} width={hp(2)} />
                </TouchableOpacity>
                {isEnabled && <Input
                    withRightIcon
                    autoFocus={true}
                    placeholder={appConstant.enterPassword}
                    value={password}
                    placeholderTextColor={passwordFocus ? colors.black : colors.white}
                    onChangeText={setPassword}
                    keyboardType={'default'}
                    returnKeyType={'next'}
                    secureTextEntry={!showPassword ? true : false}
                    onFocus={() => setPasswordFocus(true)}
                    onBlur={() => setPasswordFocus(!passwordFocus)}
                    inputStyle={[styles.textInput, { color: colors.black }]}
                    fontName={'poppins-regular'}
                    onSubmit={onSubmitPin}
                    fontSize={normalize(22)}
                    style={[styles.textInputContainer, {
                        backgroundColor:
                            passwordFocus == true
                                ? colors.white
                                : colors.gray,
                    }]}
                    rightIcon={
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ?
                                <SvgIcons.BlackShowEye height={hp(2.5)} width={hp(2.5)} />
                                :
                                <SvgIcons.BlackHideEye height={hp(2.5)} width={hp(2.5)} />
                            }
                        </TouchableOpacity>
                    }
                />}
            </View>

            <WalletCard style={[styles.walletCardContainer, { bottom: isEnabled ? hp(18) : Platform.OS === 'android' ? hp(-2) : hp(-4) }]}
                title={appConstant.hiddenWallet}
                headerStyle={{ borderColor: colors.black }}
                titleColor={'black'}
                children={
                    <>
                        <FontText size={normalize(22)} color={'white'} name={'inter-regular'}>
                            {appConstant.passphrase}
                        </FontText>
                        <ToggleSwitch
                            isOn={isEnabled}
                            onColor={colors.white}
                            offColor={colors.black}
                            thumbOnStyle={{ borderRadius: 2, height: 17, width: 15, backgroundColor: colors.black, left: 12 }}
                            thumbOffStyle={{ borderRadius: 2, height: 17, width: 15 }}
                            trackOnStyle={{ borderRadius: 4, width: 50, padding: 12 }}
                            trackOffStyle={{ borderRadius: 2, width: 50, padding: 12 }}
                            size="small"
                            onToggle={toggleSwitch}
                        />
                    </>
                }
            />
            <Button
                flex={null}
                height={hp(7)}
                width="90%"
                type="highlight"
                borderRadius={11}
                bgColor="white"
                onPress={handleEnterClick}
                style={styles.button}>
                <FontText name={"inter-medium"} size={normalize(22)} color="black">
                    {appConstant.enter}
                </FontText>
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        alignItems: 'center',
    },
    subContainer: {
        justifyContent: 'center',
        alignItems: "center",
        height: hp(65),
    },
    buttonConatiner: {
        backgroundColor: colors.gray,
        height: hp(8),
        width: wp(90),
        borderRadius: wp(2),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: wp(4)
    },
    textInputContainer: {
        marginTop: hp(2),
        height: hp(8),
        width: wp(90)
    },
    textInput: {
        fontSize: normalize(22),
        padding: 0,
        paddingHorizontal: wp(4)
    },
    walletCardContainer: {
        backgroundColor: colors.gray,
        width: wp(95),
        // paddingBottom: hp(2.5),
        justifyContent: 'center',
        alignItems: 'center',

    },
    button: {
        backgroundColor: colors.white,
        bottom: hp(4),
        alignItems: 'center',
        position: 'absolute',
    }
})