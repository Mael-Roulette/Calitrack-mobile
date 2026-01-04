import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle } from "react-native-svg";

interface SessionRestProps {
    restTime: number;
    onRestComplete: () => void;
    onPerformanceSubmit: ( reachValue: number, notes?: string ) => void;
    targetValue: number;
    exerciseFormat: "hold" | "repetition";
}

const SessionRest = ( {
    restTime,
    onRestComplete,
    onPerformanceSubmit,
    targetValue,
    exerciseFormat,
}: SessionRestProps ) => {
    const [ timeRemaining, setTimeRemaining ] = useState( restTime );
    const [ isRunning, setIsRunning ] = useState( true );
    const [ performanceValue, setPerformanceValue ] = useState( "" );
    const [ performanceNotes, setPerformanceNotes ] = useState( "" );
    const [ performanceSubmitted, setPerformanceSubmitted ] = useState( false );

    useEffect( () => {
        if ( !isRunning || timeRemaining <= 0 ) return;

        const interval = setInterval( () => {
            setTimeRemaining( ( prev ) => {
                if ( prev <= 1 ) {
                    setIsRunning( false );
                    return 0;
                }
                return prev - 1;
            } );
        }, 1000 );

        return () => clearInterval( interval );
    }, [ isRunning, timeRemaining ] );

    const toggleTimer = () => {
        setIsRunning( !isRunning );
    };

    const handlePerformanceSubmit = () => {
        const value = parseInt( performanceValue );

        if ( isNaN( value ) || value < 0 ) {
            Alert.alert( "Erreur", "Veuillez entrer une valeur valide" );
            return;
        }

        onPerformanceSubmit( value, performanceNotes );
        setPerformanceSubmitted( true );
    };

    const handleContinue = () => {
        if ( !performanceSubmitted ) {
            Alert.alert(
                "Performance non enregistrée",
                "Voulez-vous continuer sans enregistrer votre performance ?",
                [
                    { text: "Retour", style: "cancel" },
                    {
                        text: "Continuer",
                        onPress: () => {
                            // Enregistrer une valeur par défaut (0 ou targetValue)
                            onPerformanceSubmit( 0, "Non renseigné" );
                            onRestComplete();
                        },
                    },
                ]
            );
            return;
        }
        onRestComplete();
    };

    const formatTime = ( seconds: number ) => {
        const mins = Math.floor( seconds / 60 );
        const secs = seconds % 60;
        return `${mins.toString().padStart( 2, "0" )}:${secs
            .toString()
            .padStart( 2, "0" )}`;
    };

    const progress = ( restTime - timeRemaining ) / restTime;
    const size = 256;
    const strokeWidth = 8;
    const radius = ( size - strokeWidth ) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    const performanceLabel =
        exerciseFormat === "hold"
            ? "Temps tenu (secondes)"
            : "Répétitions effectuées";

    return (
        <>
            <ScrollView className="flex-1">
                <View className="flex-row justify-center items-center gap-3 mt-2 mb-8">
                    <Ionicons name="time-outline" size={ 40 } color="#FC7942" />
                    <Text className="title text-center">Temps de repos</Text>
                </View>

                {/* Timer circulaire */ }
                <View className="items-center justify-center mb-8">
                    <View style={ { width: size, height: size } }>
                        <Svg width={ size } height={ size }>
                            <Circle
                                cx={ size / 2 }
                                cy={ size / 2 }
                                r={ radius }
                                stroke="#132541"
                                strokeWidth={ strokeWidth }
                                strokeOpacity={ 0.1 }
                                fill="none"
                            />
                            <Circle
                                cx={ size / 2 }
                                cy={ size / 2 }
                                r={ radius }
                                stroke="#FC7942"
                                strokeWidth={ strokeWidth }
                                strokeDasharray={ circumference }
                                strokeDashoffset={ strokeDashoffset }
                                strokeLinecap="round"
                                fill="none"
                                rotation="-90"
                                origin={ `${size / 2}, ${size / 2}` }
                            />
                        </Svg>

                        <View
                            className="absolute inset-0 items-center justify-center"
                            style={ {
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            } }
                        >
                            <Text className="text-6xl font-sbold text-primary">
                                { formatTime( timeRemaining ) }
                            </Text>
                            <Text className="text-primary-100 font-sregular text-base mt-2">
                                { timeRemaining === 0
                                    ? "Repos terminé !"
                                    : "restantes" }
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Formulaire de performance */ }
                <View className="bg-secondary/10 rounded-2xl p-4 mb-4">
                    <Text className="title-3 mb-4 text-center">
                        Comment s&apos;est passé votre set ?
                    </Text>

                    <Text className="text-primary-100 text-sm mb-2">
                        Objectif : { targetValue }{ " " }
                        { exerciseFormat === "hold" ? "secondes" : "répétitions" }
                    </Text>

                    <CustomInput
                        label={ performanceLabel }
                        placeholder={ targetValue.toString() }
                        value={ performanceValue }
                        onChangeText={ setPerformanceValue }
                        keyboardType="numeric"
                        editable={ !performanceSubmitted }
                    />

                    <CustomInput
                        label="Notes (optionnel)"
                        placeholder="Ex: Trop facile, augmenter la difficulté..."
                        value={ performanceNotes }
                        onChangeText={ setPerformanceNotes }
                        multiline={ true }
                        numberOfLines={ 3 }
                        customStyles="h-20"
                        editable={ !performanceSubmitted }
                    />

                    { !performanceSubmitted && (
                        <CustomButton
                            title="Enregistrer ma performance"
                            variant="secondary"
                            onPress={ handlePerformanceSubmit }
                            customStyles="mt-2"
                        />
                    ) }

                    { performanceSubmitted && (
                        <View className="bg-green-100 p-3 rounded-md mt-2">
                            <Text className="text-green-800 text-center font-sregular">
                                ✓ Performance enregistrée
                            </Text>
                        </View>
                    ) }
                </View>
            </ScrollView>

            {/* Boutons de contrôle */ }
            <View className="w-full gap-3">
                { timeRemaining > 0 ? (
                    <>
                        <CustomButton
                            title={ isRunning ? "Pause" : "Reprendre" }
                            variant="secondary"
                            onPress={ toggleTimer }
                        />
                        <CustomButton
                            title="Passer le repos"
                            onPress={ handleContinue }
                        />
                    </>
                ) : (
                    <CustomButton
                        title="Continuer"
                        onPress={ handleContinue }
                    />
                ) }
            </View>
        </>
    );
};

export default SessionRest;