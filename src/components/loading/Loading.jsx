
const Loading = () => {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
        }}>
            <img src="/loading.gif" alt="로딩 중" width={100} height={100} />

        </div>
    );
};

export default Loading;
