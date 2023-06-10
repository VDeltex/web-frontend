import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { Flex, Text } from '@broxus/react-uikit'
import { TokenAmountInput } from '@broxus/react-components'
import classNames from 'classnames'
import './TextInput.scss'

export type TextInputProps = {
    autoFocus?: boolean;
    placeholder?: string;
    value?: string;
    disabled?: boolean;
    id?: string;
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    readOnly?: boolean;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: (value: string) => void;
    onChangeInput?: React.ChangeEventHandler<HTMLInputElement>;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    maxValue?: string;
    borderButtom?: boolean;
    showMaxButton?: boolean
}

function TextInputInner({
    autoFocus,
    placeholder,
    value = '',
    disabled,
    id,
    inputMode,
    readOnly,
    onBlur,
    onChange,
    onFocus,
    maxValue,
    borderButtom,
    showMaxButton = false,
}: TextInputProps): JSX.Element {
    const _onChange = (_: string): void => {
        onChange?.(_)
    }
    return (
        <Flex
            flexDirection="column" className={classNames(borderButtom && 'text-input-border-buttom')}
        >
            <TokenAmountInput
                autoFocus={autoFocus}
                placeholder={placeholder}
                id={id}
                inputMode={inputMode}
                value={value}
                disabled={disabled}
                showMaxButton={showMaxButton}
                maxValue={maxValue}
                readOnly={readOnly}
                onBlur={onBlur}
                onChange={_onChange}
                onFocus={onFocus}
                className="text-input"
                iconSize={24}
            />
        </Flex>
    )
}

export const TextInput = observer(TextInputInner)
