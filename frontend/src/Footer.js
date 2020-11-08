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
        top: "auto",
        bottom: 0,
    },
    text: {
        padding: 24,
    },
}));

function Footer() {
    const classes = useStyles();

    return (
        <AppBar position="absolute" color="inherit" className={classes.root}>
            <Typography
                align="center"
                variant="caption"
                className={classes.text}
            >
                This web application was created for Liquid Hacks 2020, using
                ReactJS, Flask, and the LiquipediaDB API. Feel free to check out
                the{" "}
                <Link
                    href="https://github.com/matthewyu01/merge-esports-TL-Hacks"
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
