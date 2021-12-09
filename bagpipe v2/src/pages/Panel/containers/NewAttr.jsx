import React, { } from 'react';
import 'antd/dist/antd.css';
import { useLocation } from 'react-router-dom';

const NewAttr = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);

    let query = useQuery();
    const recipeId = query.get('recipeId')

    return (
        <div>
            recipe id: {recipeId}
        </div>
    )
}

export default NewAttr