import { BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '../../assets/colors'
import { hp, normalize, wp } from '../../helper/responsiveScreen'
import Header from '../../components/common/Header'
import { useTranslation } from 'react-i18next'
import Input from '../../components/common/Input'
import SvgIcons from '../../assets/SvgIcons'
import FontText from '../../components/common/FontText'
import Button from '../../components/common/Button'
import appConstant from '../../helper/appConstant'

export default function CreateAccountScreen({ navigation }) {
  const { t } = useTranslation();
  const [walletName, setWalletName] = useState('')
  const [walletNameFocus, setWalletNameFocus] = useState(true)
  const [isSelect, setIsSelect] = useState(false)

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return async () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const backAction = () => {
    navigation.goBack()
    return true;
  };

  const onWalletNameFocus = () => {
    setWalletNameFocus(true)
    setIsSelect(false)
  }

  const onWalletNameBlur = () => {
    setWalletNameFocus(!walletNameFocus)
  }

  const onWalletNameSubmit = () => {
    setWalletNameFocus(false)
    setIsSelect(true)
  }

  const handleCreateClick = () => {

  }

  return (
    <View style={styles.container}>
      <Header title={t("createAccount")} showRightIcon RightIcon={'info'} showBackIcon onBackPress={backAction} statusBarcolor={colors.black} style={{ alignSelf: 'center' }} />
      <View style={styles.subContainer}>
        <Input
          withRightIcon={walletName !== '' ? true : false}
          placeholder={t("walletName")}
          value={walletName}
          editable={walletNameFocus ? true : false}
          maxLength={15}
          placeholderTextColor={walletNameFocus ? colors.black : colors.white}
          onChangeText={setWalletName}
          keyboardType={'default'}
          blurOnSubmit={false}
          returnKeyType={'next'}
          onFocus={onWalletNameFocus}
          onBlur={onWalletNameBlur}
          onSubmit={onWalletNameSubmit}
          fontName={'poppins-regular'}
          onSubmitEditing={onWalletNameSubmit}
          fontSize={normalize(22)}
          inputStyle={[styles.textInput, {
            color: walletNameFocus == true
              ? colors.black
              : colors.white
          }]}
          style={[styles.textInputContainer,
          {
            backgroundColor:
              walletNameFocus == true
                ? colors.white
                : colors.gray,
          }]}
          rightIcon={
            <TouchableOpacity>
              {walletNameFocus ?
                <SvgIcons.BlackCheck height={hp(4)} width={hp(2.5)} /> :
                <SvgIcons.Check height={hp(4)} width={hp(2.5)} />
              }
            </TouchableOpacity>
          }
        />
        <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: isSelect ? colors.white : colors.gray }]} onPress={() => {
          console.log("sdhgs")
          setIsSelect(true)
          setWalletNameFocus(false)
          navigation.navigate(appConstant.selectAccount)
        }}>
          <View style={[styles.numberContainer, { backgroundColor: isSelect ? colors.black : colors.white }]}>
            <FontText name={"inter-bold"} size={normalize(15)} color={isSelect ? 'white' : 'black'}>
              {"0"}
            </FontText>
          </View>
          <FontText name={"inter-regular"} size={normalize(22)} color={isSelect ? 'black' : 'white'} pRight={wp(16)} >
            {"0xa94bb...a710"}
          </FontText>
          {isSelect && <SvgIcons.BlackRightArrow height={hp(3)} width={hp(2.5)} />
            // <SvgIcons.Check height={hp(4)} width={hp(2.5)} />
          }
        </TouchableOpacity>
      </View>
      <Button
        flex={null}
        type="highlight"
        borderRadius={11}
        bgColor="white"
        onPress={handleCreateClick}
        buttonStyle={styles.button}>
        <FontText name={"inter-medium"} size={normalize(22)} color="black">
          {t("create")}
        </FontText>
      </Button>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: wp(3.5),
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: hp(20)
  },
  button: {
    alignItems: 'center',
    width: wp(90),
  },
  textInputContainer: {
    marginTop: hp(2),
    height: hp(8.5),
    width: wp(90)
  },
  textInput: {
    fontSize: normalize(22),
    padding: 0,
    paddingHorizontal: wp(4)
  },
  buttonContainer: {
    height: hp(8.5),
    width: wp(90),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },
  numberContainer: {
    height: hp(3.5),
    width: wp(6.3),
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: colors.white,
    marginBottom: hp(3),
    height: hp(8.5),
    width: wp(90)
  }
})