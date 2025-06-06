import { LemonSkeleton } from '@posthog/lemon-ui'
import { useActions, useValues } from 'kea'
import { errorPropertiesLogic } from 'lib/components/Errors/errorPropertiesLogic'
import { stackFrameLogic } from 'lib/components/Errors/stackFrameLogic'
import { ExceptionHeaderProps } from 'lib/components/Errors/StackTraces'
import { ErrorTrackingException, ErrorTrackingStackFrame } from 'lib/components/Errors/types'
import { cn } from 'lib/utils/css-classes'
import { useCallback, useEffect } from 'react'

import { exceptionCardLogic } from '../exceptionCardLogic'
import { StacktraceBaseDisplayProps, StacktraceBaseExceptionHeaderProps } from './StacktraceBase'

export function StacktraceTextDisplay({
    className,
    renderLoading,
    renderEmpty,
    truncateMessage,
}: StacktraceBaseDisplayProps): JSX.Element {
    const { exceptionList, hasStacktrace } = useValues(errorPropertiesLogic)
    const { loading } = useValues(exceptionCardLogic)
    const renderExceptionHeader = useCallback(
        ({ type, value, loading, part }: ExceptionHeaderProps): JSX.Element => {
            return (
                <StacktraceTextExceptionHeader
                    type={type}
                    value={value}
                    part={part}
                    loading={loading}
                    truncate={truncateMessage}
                />
            )
        },
        [truncateMessage]
    )
    return (
        <div className={className}>
            {loading
                ? renderLoading(renderExceptionHeader)
                : exceptionList.map((exception: ErrorTrackingException) => (
                      <ExceptionTextDisplay key={exception.id} exception={exception} />
                  ))}
            {!loading && !hasStacktrace && renderEmpty()}
        </div>
    )
}

export function StacktraceTextExceptionHeader({
    type,
    value,
    loading,
}: StacktraceBaseExceptionHeaderProps): JSX.Element {
    return (
        <div className={cn('font-mono')}>
            {loading ? (
                <div>
                    <LemonSkeleton className="h-2 w-1/2" />
                </div>
            ) : (
                <>
                    {type}: {value}
                </>
            )}
        </div>
    )
}

function ExceptionTextDisplay({ exception }: { exception: ErrorTrackingException }): JSX.Element {
    const { showAllFrames } = useValues(exceptionCardLogic)
    return (
        <div>
            <p className="font-mono mb-0 font-bold line-clamp-1">
                {exception.type}: {exception.value}
            </p>
            {(exception.stacktrace?.frames || [])
                .filter((frame: ErrorTrackingStackFrame) => (showAllFrames ? true : frame.in_app))
                .map((frame, idx) => (
                    <StackframeTextDisplay key={idx} frame={frame} />
                ))}
        </div>
    )
}

function StackframeTextDisplay({ frame }: { frame: ErrorTrackingStackFrame }): JSX.Element {
    const { stackFrameRecords } = useValues(stackFrameLogic)
    const { loadFromRawIds } = useActions(stackFrameLogic)
    useEffect(() => {
        loadFromRawIds([frame.raw_id])
    }, [loadFromRawIds, frame.raw_id])
    return (
        <>
            <p className="font-mono indent-[1rem] whitespace-no-wrap mb-0 line-clamp-1">
                File "{frame.source}", line: {frame.line}, in: {frame.resolved_name}
            </p>
            {stackFrameRecords[frame.raw_id] && stackFrameRecords[frame.raw_id].context?.line.line && (
                <p className="font-mono indent-[2rem] whitespace-no-wrap mb-0 text-tertiary line-clamp-1">
                    {stackFrameRecords[frame.raw_id].context?.line.line}
                </p>
            )}
        </>
    )
}
