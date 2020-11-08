import {
    AppBar,
    Link,
    makeStyles,
    Typography,
    useTheme,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 48,
    },
    text: {
        paddingTop: 24,
        paddingBottom: 24,
    },
}));

function Footer() {
    const classes = useStyles();

    return (
        <AppBar position="static" color="inherit" className={classes.root}>
            <Typography
                align="center"
                variant="caption"
                className={classes.text}
            >
                This web application was created for Liquid Hacks 2020, using
                ReactJS, Flask, and the LiquipediaDB API. Feel free to check out
                the{" "}
                <Link
                    href="https://github.com/matthewyu01/liquid-hacks-temp"
                    target="_blank"
                    color="inherit"
                >
                    source code on GitHub
                </Link>
                .
            </Typography>
        </AppBar>
    );
}

export default Footer;
