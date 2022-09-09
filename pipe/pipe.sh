#!/usr/bin/env bash
# Required globals:
#   AWS_ACCESS_KEY_ID
#   AWS_SECRET_ACCESS_KEY
#
# Optional globals:
#   DEBUG
#   COMMIT_ID
#   CDK_COMMAND
#   CKD_STACK
#   NPM_COMMANDS
#   BEFORE_SCRIPT
#   AFTER_SCRIPT
#   CKD_COMMAND_EXT

# Setting current working directory
cd "$(dirname "$0")"

# BitBucket pipe toolkit
source "$(dirname "$0")/common.sh"

info "executing the pipe..."

# Debuging mode
DEBUG=${DEBUG:="false"}

executions(){
    status=$1
    shift
    command=$@
    if [[ "${status}" == "0" ]]; then
        success "execution successful: ${command}"
    else
        fail "error executing: ${command}"
    fi
}

before_script(){
    if [[ ! -z ${BEFORE_SCRIPT} ]]; then
        warning "BEFORE_SCRIPT environment variable has been set: ${BEFORE_SCRIPT}"
        info "executing: before script: ${BEFORE_SCRIPT}"
        run ${BEFORE_SCRIPT}
        executions ${status} ${BEFORE_SCRIPT}
    fi
}

after_script(){
    if [[ ! -z ${AFTER_SCRIPT} ]]; then
        warning "AFTER_SCRIPT environment variable has been set: ${AFTER_SCRIPT}"
        info "executing: after script: ${AFTER_SCRIPT}"
        run ${AFTER_SCRIPT}
        executions ${status} ${AFTER_SCRIPT}
    fi
}

npm_commands(){
    info "executing: npm commands: ${NPM_COMMANDS}"
    run ${NPM_COMMANDS}
    executions ${status} ${NPM_COMMANDS}
}

cdk_commands(){
    info "executing: cdk command: cdk ${COMMAND} ${STACK} ${CKD_COMMAND_EXT}"
    run npx cdk ${COMMAND} ${STACK} ${CKD_COMMAND_EXT}
    executions ${status} "npx cdk ${COMMAND} ${STACK} ${CKD_COMMAND_EXT}"
}

authentication() {
    info "using default authentication with AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY."
    AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID:?'AWS_ACCESS_KEY_ID variable missing.'}
    AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY:?'AWS_SECRET_ACCESS_KEY variable missing.'}
}

preflight(){
    info "setting up the environment"
    # Test if the commit identifier is provided
    if [[ -z ${COMMIT_ID} ]]; then
        warning "commit identifier is not specified"
    fi
    # Test if cdk command has been overided
    if [[ -z ${CDK_COMMAND} ]]; then
        COMMAND="deploy"
    else
        COMMAND=${CDK_COMMAND}
        warning "cdk command has been altered: ${CDK_COMMAND}"
    fi
    # Test if command extension is provided
    if [[ -z ${CKD_COMMAND_EXT} ]]; then
        CKD_COMMAND_EXT=""
    else
        CKD_COMMAND_EXT=${CKD_COMMAND_EXT}
        warning "CKD_COMMAND_EXT environment variable has been set: ${CKD_COMMAND_EXT}"
    fi
    # Test if stack is specified
    if [[ -z ${CKD_STACK} ]]; then
        STACK="--all"
    else
        STACK=${CKD_STACK}
        warning "CDK_STACK environment variable has been set: ${CDK_STACK}"
    fi
    # npm commands
    if [[ -z ${NPM_COMMANDS} ]]; then
        NPM_COMMANDS="npm ci"
    else
        warning "NPM_COMMAND env has been set: ${NPM_COMMANDS}"
        NPM_COMMANDS=${NPM_COMMANDS}
    fi
    # Set --require-approval never
    if [[ ${COMMAND} = 'deploy' ]] && [[ "{$CKD_COMMAND_EXT}" != *"--require-approval"* ]]; then
        CKD_COMMAND_EXT="--require-approval never ${CKD_COMMAND_EXT}"
    else
        CKD_COMMAND_EXT=""
    fi
}

authentication
preflight

before_script
npm_commands
cdk_commands

after_script