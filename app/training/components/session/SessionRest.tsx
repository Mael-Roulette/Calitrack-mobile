import CustomButton from "@/components/CustomButton";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Svg, { Circle } from "react-native-svg";

interface SessionRestProps {
    restTime: number; // en secondes
    onRestComplete: () => void;
}

const SessionRest = ( { restTime, onRestComplete }: SessionRestProps ) => {
    const [ timeRemaining, setTimeRemaining ] = useState( restTime );
    const [ isRunning, setIsRunning ] = useState( true );

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

    const skipRest = () => {
        setTimeRemaining( 0 );
        setIsRunning( false );
        onRestComplete();
    };

    const formatTime = ( seconds: number ) => {
        const mins = Math.floor( seconds / 60 );
        const secs = seconds % 60;
        return `${mins.toString().padStart( 2, "0" )}:${secs.toString().padStart( 2, "0" )}`;
    };

    // Calcul de la progression (0 à 1)
    const progress = ( restTime - timeRemaining ) / restTime;

    // Paramètres du cercle SVG
    const size = 256; // Taille du cercle
    const strokeWidth = 8;
    const radius = ( size - strokeWidth ) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <>
            <ScrollView className="flex-1">
                <View className="flex-row justify-center items-center gap-3 mt-2 mb-8">
                    <Ionicons name="time-outline" size={ 40 } color="#FC7942" />
                    <Text className="title text-center">Temps de repos</Text>
                </View>

                {/* Timer circulaire avec SVG */ }
                <View className="items-center justify-center">
                    <View style={ { width: size, height: size } }>
                        <Svg width={ size } height={ size }>
                            {/* Cercle de fond */ }
                            <Circle
                                cx={ size / 2 }
                                cy={ size / 2 }
                                r={ radius }
                                stroke="#132541"
                                strokeWidth={ strokeWidth }
                                strokeOpacity={ 0.1 }
                                fill="none"
                            />

                            {/* Cercle de progression */ }
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

                        {/* Temps restant au centre */ }
                        <View
                            className="absolute inset-0 items-center justify-center"
                            style={ {
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0
                            } }
                        >
                            <Text className="text-6xl font-sbold text-primary">
                                { formatTime( timeRemaining ) }
                            </Text>
                            <Text className="text-primary-100 font-sregular text-base mt-2">
                                { timeRemaining === 0 ? "Repos terminé !" : "restantes" }
                            </Text>
                        </View>
                    </View>
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
                            onPress={ skipRest }
                        />
                    </>
                ) : (
                    <CustomButton
                        title="Continuer"
                        onPress={ onRestComplete }
                    />
                ) }
            </View>
        </>
    );
};

export default SessionRest;