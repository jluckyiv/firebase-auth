port module Main exposing (main)

import Browser
import Html exposing (Html, button, div, p, text)
import Html.Attributes exposing (class, disabled, id)
import Html.Events exposing (onClick)
import Json.Decode as D
import Json.Encode as E



-- MODEL


type alias Model =
    Maybe String


init : Maybe String -> ( Model, Cmd Msg )
init currentUser =
    ( currentUser, Cmd.none )



-- VIEW


type Msg
    = NoOp
    | UserChanged D.Value
    | ToggleSignIn


unwrapUser : D.Value -> Maybe String
unwrapUser value =
    let
        userResult =
            D.decodeValue D.string value
    in
    Result.toMaybe userResult


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        UserChanged userValue ->
            let
                user =
                    unwrapUser userValue
            in
            ( user, Cmd.none )

        ToggleSignIn ->
            ( model, toggleSignIn E.null )


view model =
    let
        button_ =
            case model of
                Nothing ->
                    button
                        [ disabled False, id "quickstart-sign-in", class "button is-info", onClick ToggleSignIn ]
                        [ text "Sign in with Google" ]

                Just "isSigningIn" ->
                    button
                        [ disabled True, id "quickstart-sign-in", class "button is-info is-loading" ]
                        [ text "Sign in with Google" ]

                Just user ->
                    button
                        [ disabled False, id "quickstart-sign-in", class "button is-success", onClick ToggleSignIn ]
                        [ text ("Sign out " ++ user) ]
    in
    div []
        [ button_
        ]


main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }


subscriptions model =
    Sub.batch [ userChanged UserChanged ]


port toggleSignIn : D.Value -> Cmd msg


port userChanged : (D.Value -> msg) -> Sub msg
