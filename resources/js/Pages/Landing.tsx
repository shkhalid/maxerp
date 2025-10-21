interface LandingProps {
    auth: {
        user: any;
    };
}

function Landing({ auth }: LandingProps): JSX.Element {
    return (
        <div className="min-h-screen overflow-hidden">
            <h1>Testing</h1>
        </div>
    );
}

export default Landing;
