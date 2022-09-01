/// <reference types="../CTAutocomplete"/>
/// <reference lib="es2015"/>

import { @Vigilant, @TextProperty, @SwitchProperty, @ButtonProperty, 
    @NumberProperty, @SelectorProperty, @SliderProperty, @ColorProperty, Color, @ParagraphProperty } from 'Vigilance';

@Vigilant("AutoReconnect", "AutoReconnect")
class Settings {

    @SwitchProperty({
        name: "Rejoin after disconnect",
        category: "General",
        subcategory: "Settings",
        hidden: false
    })
    islandRejoinEnabled = false;

    @SwitchProperty({
        name: "Visit specific island",
        category: "General",
        subcategory: "Settings",
        hidden: false
    })
    visitingEnabled = false;

    @TextProperty({
        name: "Visit Username",
        category: "General",
        subcategory: "Visiting",
        hidden: false
    })
    visitName = "Username";

    @SelectorProperty({
        name: "Visit Profile Name",
        category: "General",
        subcategory: "Visiting",
        hidden: false,
        options: ['Apple', 'Banana', 'Blueberry', 'Coconut', 'Cucumber', 'Grapes', 'Kiwi', 'Lemon', 'Lime', 'Mango', 'Orange', 'Papaya', 'Pear', 'Peach', 
                 'Pineapple', 'Pomegranate', 'Raspberry', 'Strawberry', 'Tomato', 'Watermelon', 'Zucchini']
    })
    visitCuteName = 0;

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", "Settings", "General Settings")
    }
}

export default new Settings();
    