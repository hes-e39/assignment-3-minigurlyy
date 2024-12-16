import type React from 'react';

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'medium', color = '#4CAF50' }) => {
    const sizeMap = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    return <div className={`${sizeMap[size]} border-4 border-t-transparent border-${color} rounded-full animate-spin`} />;
};

export default Loading;

// import styled from 'styled-components';

// const primaryColor = '#ffa2bf';

// type Size = 'small' | 'medium' | 'large';

// const sizeMapping: Record<Size, number> = {
//     small: 10,
//     medium: 14,
//     large: 20,
// };

// const Container = styled.div`
//   animation: spin 1.5s linear infinite;

//   @-moz-keyframes spin {
//     100% {
//       -moz-transform: rotate(360deg);
//     }
//   }
//   @-webkit-keyframes spin {
//     100% {
//       -webkit-transform: rotate(360deg);
//     }
//   }
//   @keyframes spin {
//     100% {
//       -webkit-transform: rotate(360deg);
//       transform: rotate(360deg);
//     }
//   }
// `;

// const Dot = styled.span<{ size: number }>`
//   display: block;
//   width: ${props => props.size}px;
//   height: ${props => props.size}px;
//   background-color: ${props => props.color};
//   border-radius: 100%;
//   transform: scale(0.75);
//   transform-origin: 50% 50%;
//   opacity: 0.3;
//   animation: wobble 1s ease-in-out infinite;

//   @keyframes wobble {
//     0% {
//       border-radius: 25%;
//     }
//     100% {
//       border-radius: 100%;
//     }
//   }
// `;

// const DotGroup = styled.div`
//   display: flex;
// `;

// const Loading = ({
//     size = 'medium',
//     color = primaryColor,
// }: {
//     size: Size;
//     color: string;
// }) => {
//     return (
//         <Container>
//             <DotGroup>
//                 <Dot size={sizeMapping[size]} color={color} />
//                 <Dot size={sizeMapping[size]} color={color} />
//             </DotGroup>
//             <DotGroup>
//                 <Dot size={sizeMapping[size]} color={color} />
//                 <Dot size={sizeMapping[size]} color={color} />
//             </DotGroup>
//         </Container>
//     );
// };

// export default Loading;
