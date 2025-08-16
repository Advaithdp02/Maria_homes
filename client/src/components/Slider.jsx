// MyRangeSlider.jsx
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import '../styles/Slider.css'

export default function MyRangeSlider({ start,end,min, max, value, onChange,step }) {
    return (
        <RangeSlider
            defaultValue={[start, end]}
            min={min}
            max={max}
            value={value}
            onInput={onChange}
            step={step}
        />
    );
}
